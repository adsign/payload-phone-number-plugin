import type { TextField, Validate } from 'payload';

import * as libphonenumber from 'google-libphonenumber';

import type { RegionCode } from '../types.js';

let phoneUtil: libphonenumber.PhoneNumberUtil | null = null;

export const createPhoneNumberValidator = (allowedCountries?: RegionCode[]): Validate<string, unknown, unknown, TextField> => {
    return (value, { req, required }) => {
        if (!phoneUtil) {
            phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        }

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
            const number = phoneUtil.parse(phoneNumberValue);
            if (!phoneUtil.isValidNumber(number)) {
                // @ts-expect-error - translations are not typed in plugins yet
                return req.t('payload-phone-number-plugin:invalidPhoneNumber');
            }

            if (allowedCountries && allowedCountries.length > 0) {
                const regionCode = phoneUtil.getRegionCodeForNumber(number);
                if (regionCode && !allowedCountries.includes(regionCode as RegionCode)) {
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
