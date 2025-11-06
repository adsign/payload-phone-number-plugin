import type { PhoneNumber } from '../types.js';

import * as libphonenumber from 'google-libphonenumber';

import { countries } from './countries.js';

let phoneUtil: libphonenumber.PhoneNumberUtil | null = null;
let PNF: typeof libphonenumber.PhoneNumberFormat | null = null;

export function getPhoneNumberDetails(e164PhoneNumber: string): PhoneNumber | null {
    if (!phoneUtil || !PNF) {
        phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        PNF = libphonenumber.PhoneNumberFormat;
    }

    try {
        const number = phoneUtil.parse(e164PhoneNumber);
        const regionCode = phoneUtil.getRegionCodeForNumber(number);

        if (!regionCode) {
            return null;
        }

        const national = phoneUtil.format(number, PNF.NATIONAL);
        const international = phoneUtil.format(number, PNF.INTERNATIONAL);
        const e164Formatted = phoneUtil.format(number, PNF.E164);

        const country = countries.find((c) => c.regionCode === regionCode);
        const callingCode = country?.callingCode || `+${number.getCountryCode()}`;

        return {
            e164: e164Formatted,
            regionCode,
            callingCode,
            national,
            international,
        };
    } catch {
        return null;
    }
}
