import { MessengerServer } from '../common/util/messenger';
import { assertCurrentContextType } from '../common/util/util';

assertCurrentContextType('background_script');

export type OptionsPageParameter = {
    defaultSelectedSection?: string;
};

let optionsPageParameter: OptionsPageParameter | undefined;
export function setOptionsPageParameter(param: OptionsPageParameter): void {
    optionsPageParameter = param;
}
export function getOptionsPageParameter(): OptionsPageParameter | undefined {
    const param = optionsPageParameter;
    optionsPageParameter = undefined;
    return param;
}

MessengerServer.addInstruction({ setOptionsPageParameter, getOptionsPageParameter });
