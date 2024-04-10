import { callMoodleMobileAPI } from "./mobileAPI";

export type SiteInfo = {
    sitename: string;
    username: string;
    firstname: string;
    lastname: string;
    fullname: string;
    lang: string;
    userid: number;
    siteurl: string;
    userpictureurl: string;
    functions: SiteFunction[];
    downloadfiles: number;
    uploadfiles: number;
    release: string;
    version: string;
    mobilecssurl: string;
    advancedfeatures: Advancedfeature[];
    usercanmanageownfiles: boolean;
    userquota: number;
    usermaxuploadfilesize: number;
    userhomepage: number;
    userprivateaccesskey: string;
    siteid: number;
    sitecalendartype: string;
    usercalendartype: string;
    userissiteadmin: boolean;
    theme: string;
    limitconcurrentlogins: number;
};

export type SiteFunction = {
    name: string;
    version: string;
};

export type Advancedfeature = {
    name: string;
    value: number;
};

/**
 * core_webservice_get_site_info
 */
export async function core_webservice_get_site_info(): Promise<SiteInfo> {
    return await callMoodleMobileAPI({
        methodname: "core_webservice_get_site_info",
        args: {},
    });
}
