import { doLogin } from '../../../auto-login/auto-login';
import { DayOfWeek, DayPeriod, Term } from './course';
import { assertCurrentContextType, fetchHtml, postForm } from '../../util/util';
import { InvalidResponseError, LoginRequiredError, UnderMaintenanceError } from '../../error';
import { MessengerServer } from '../../util/messenger';

assertCurrentContextType('background_script');

export type CourseRegistrationInfo = {
    termDayPeriods: {
        //学期・曜日・時限
        term: Term;
        dayPeriod: DayPeriod;
    }[];
    school: string; //開講学部
    note: string; //備考
    name: string; //科目名
    instructors: string[]; //担当教員
    campus: string; //キャンパス
    classroom: string; //教室名
    category: string; //科目区分
    credit: number; //単位
    status: string; //状態/希望順位
    syllabusUrl: string;
};

export async function fetchCourseRegistrationInfo(): Promise<CourseRegistrationInfo[]> {
    //成績照会・科目登録専用メニュー
    //または
    //ログインページ
    //または
    //SSO?SAMLRequest=...のページ
    let page1 = await fetchHtml('https://coursereg.waseda.jp/portal/simpleportal.php?HID_P14=JA');
    if (page1.title === 'Authentication Platform Service in Waseda University') {
        //ログインページにリダイレクトされたら、自動ログイン
        if (!(await doLogin())) throw new LoginRequiredError();
        page1 = await fetchHtml('https://coursereg.waseda.jp/portal/simpleportal.php?HID_P14=JA');
    }

    const relayState = page1.querySelector('input[name="RelayState"]');
    if (relayState) {
        //SSO?SAMLRequest=...のページなら、そのページにあるformをsubmitすると成績照会・科目登録専用メニューにリダイレクトされる
        const nextUrl = page1.getElementsByTagName('form')[0].action;
        const formData = Object.fromEntries(
            (Array.from(page1.querySelectorAll('input[name]')) as HTMLInputElement[]).map((input) => [
                input.name,
                input.value,
            ])
        );
        page1 = new DOMParser().parseFromString(await (await postForm(nextUrl, formData)).text(), 'text/html');
    }

    const formData: Record<string, string> = {
        url: 'https://wcrs.waseda.jp/kyomu/epb1110.htm',
        HID_P6: 'eStudent',
        HID_P8: 'ea02',
        pageflag: '1000',
        status: '0',
    };
    ['HID_P3', 'HID_P2', 'KojinNO', 'JITSUGEN', 'frame', 'HID_P14', 'sessionid', 'NewOldFlg'].forEach((name) => {
        formData[name] = (page1.querySelector(`input[name="${name}"]`) as HTMLInputElement).value;
    });

    //「ただいま画面を起動しています。しばらくお待ちください。」のページ
    const page2 = new DOMParser().parseFromString(
        await (await postForm('https://coursereg.waseda.jp/portal/simpleportal.php', formData)).text(),
        'text/html'
    );

    const nextUrl = page2.querySelector('form')?.getAttribute('action');
    if (!nextUrl) throw new InvalidResponseError('cannot find form');

    const formData2: Record<string, string> = Object.fromEntries(
        Array.from(page2.getElementsByTagName('input')).map((input) => [input.name, input.value])
    );

    //履修申請ページ
    const page3 = new DOMParser().parseFromString(await (await postForm(nextUrl, formData2)).text(), 'text/html');

    if (page3.body.innerHTML.indexOf('ただいまメンテナンス中です。') >= 0) {
        throw new UnderMaintenanceError();
    }

    const terms: Record<string, Term> = {
        通年: 'full_year',
        春学期: 'spring_semester',
        秋学期: 'fall_semester',
        春クォーター: 'spring_quarter',
        夏クォーター: 'summer_quarter',
        秋クォーター: 'fall_quarter',
        冬クォーター: 'winter_quarter',
    };
    const days: Record<string, DayOfWeek> = {
        月: 'monday',
        火: 'tuesday',
        水: 'wednesday',
        木: 'thursday',
        金: 'friday',
        土: 'saturday',
        日: 'sunday',
    };
    const periods: Record<string, number> = {
        '１': 1,
        '２': 2,
        '３': 3,
        '４': 4,
        '５': 5,
        '６': 6,
        '７': 7,
    };
    const info: CourseRegistrationInfo[] = [];
    for (const tr of Array.from(page3.getElementsByTagName('table')[12]?.getElementsByTagName('tr') ?? []).slice(1)) {
        const td = tr.getElementsByTagName('td');

        const term = terms[td[0].innerText.trim()];
        if (!term) {
            console.warn(`unknown term '${td[0].innerText.trim()}'`);
            continue;
        }

        const day = getTextFromElement(td[1])
            .trim()
            .split('\n')
            .map((d) => days[d]);
        const period = getTextFromElement(td[2])
            .trim()
            .split('\n')
            .map((p) => p.split('～').map((p) => periods[p]));
        const termDayPeriods = [];
        if (day.length !== period.length) {
            console.warn('day.length and period.length are not equal');
            continue;
        }

        for (let i = 0; i < day.length; i++) {
            if (!day[i]) {
                console.warn('unknown day');
                continue;
            }
            if (period[i].length === 0 || period[i].length > 2 || period[i].some((p) => p === undefined)) {
                console.warn('unknown period');
                continue;
            }

            termDayPeriods.push({
                term,
                dayPeriod: {
                    day: day[i],
                    period: {
                        from: period[i][0],
                        to: period[i][1] ?? period[i][0],
                    },
                },
            });
        }

        const school = td[3].innerText.trim();
        const note = td[4].innerText.trim();
        const name = td[5].innerText.trim();
        const instructors = getTextFromElement(td[6]).trim().split('\n');
        const campus = td[7].innerText.trim();
        const classroom = td[8].innerText.trim();
        const category = td[9].innerText.trim();
        const credit = parseInt(td[10].innerText.trim());
        if (isNaN(credit)) {
            console.warn(`unknown credit '${td[10].innerText.trim()}'`);
            continue;
        }
        const status = td[11].innerText.trim();
        const syllabusUrl = td[5].getElementsByTagName('a')[0]?.href;
        if (!syllabusUrl) {
            console.warn('missing syllabus url');
            continue;
        }

        info.push({
            termDayPeriods,
            school,
            note,
            name,
            instructors,
            campus,
            classroom,
            category,
            credit,
            status,
            syllabusUrl,
        });
    }

    return info;
}
MessengerServer.addInstruction({ fetchCourseRegistrationInfo });

function getTextFromElement(elem: HTMLElement): string {
    let str = '';
    elem.childNodes.forEach((node) => {
        if (node instanceof HTMLBRElement) {
            str += '\n';
        } else if (node.nodeType === Node.TEXT_NODE) {
            str += node.textContent;
        } else if (node instanceof HTMLElement) {
            str += getTextFromElement(node);
        }
    });
    return str;
}
