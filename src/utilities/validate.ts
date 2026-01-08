import type { TextField, Validate } from 'payload';

import { parsePhoneNumber } from 'libphonenumber-js/max';

import type { RegionCode } from '../types.js';

export const createPhoneNumberValidator = (allowedCountries?: RegionCode[]): Validate<string, unknown, unknown, TextField> => {
    return (value, { req, required }) => {
        if (!value) {
            if (required) {
                return req.t('validation:required');
            }
            return true;
        }

        let phoneNumberValue: string;
        if (typeof value === 'string') {
            phoneNumberValue = value;
        } else if (typeof value === 'object' && value !== null && 'e164' in value) {
            phoneNumberValue = (value as { e164: string }).e164;
        } else {
            // @ts-expect-error - translations are not typed in plugins yet
            return req.t('payload-phone-number-plugin:phoneNumberMustBeString');
        }

        try {
            const phoneNumber = parsePhoneNumber(phoneNumberValue);
            if (!phoneNumber.isValid()) {
                // @ts-expect-error - translations are not typed in plugins yet
                return req.t('payload-phone-number-plugin:invalidPhoneNumber');
            }

            if (allowedCountries && allowedCountries.length > 0) {
                const regionCode = phoneNumber.country;
                if (regionCode && !allowedCountries.includes(regionCode)) {
                    // @ts-expect-error - translations are not typed in plugins yet
                    return req.t('payload-phone-number-plugin:phoneNumberCountryNotAllowed');
                }
            }

            return true;
        } catch {
            // @ts-expect-error - translations are not typed in plugins yet
            return req.t('payload-phone-number-plugin:invalidPhoneNumberFormat');
        }
    };
};
