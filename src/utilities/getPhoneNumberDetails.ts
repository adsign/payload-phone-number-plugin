import type { PhoneNumber } from '../types.js';

import { parsePhoneNumber } from 'libphonenumber-js/max';

import { countries } from './countries.js';

export function getPhoneNumberDetails(e164PhoneNumber: string): PhoneNumber | null {
    try {
        const phoneNumber = parsePhoneNumber(e164PhoneNumber);

        const regionCode = phoneNumber.country;

        if (!regionCode) {
            return null;
        }

        const national = phoneNumber.formatNational();
        const international = phoneNumber.formatInternational();
        const e164Formatted = phoneNumber.number;

        const country = countries.find((c) => c.regionCode === regionCode);
        const callingCode = country?.callingCode || `+${phoneNumber.countryCallingCode}`;

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
