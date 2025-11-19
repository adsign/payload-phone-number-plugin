import type { PhoneNumber } from '../types.js';

import libphonenumber from 'google-libphonenumber';
const { PhoneNumberUtil, PhoneNumberFormat } = libphonenumber;

import { countries } from './countries.js';

let phoneUtil: libphonenumber.PhoneNumberUtil | null = null;

export function getPhoneNumberDetails(e164PhoneNumber: string): PhoneNumber | null {
    if (!phoneUtil) {
        phoneUtil = PhoneNumberUtil.getInstance();
    }

    try {
        const number = phoneUtil.parse(e164PhoneNumber);
        const regionCode = phoneUtil.getRegionCodeForNumber(number);

        if (!regionCode) {
            return null;
        }

        const national = phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
        const international = phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
        const e164Formatted = phoneUtil.format(number, PhoneNumberFormat.E164);

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
