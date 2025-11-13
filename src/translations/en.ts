import type { GenericTranslationsObject } from '@payloadcms/translations';

export const en: GenericTranslationsObject = {
    $schema: './translation-schema.json',
    'payload-phone-number-plugin': {
        phoneNumberRequired: 'Phone number is required',
        invalidPhoneNumber: 'Invalid phone number',
        invalidPhoneNumberFormat: 'Invalid phone number format for country',
        phoneNumberMustBeString: 'Phone number must be a string',
        phoneNumberCountryNotAllowed: 'Phone number must be from one of the allowed countries',
    },
};
