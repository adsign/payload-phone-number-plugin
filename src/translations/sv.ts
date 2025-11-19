import type { GenericTranslationsObject } from '@payloadcms/translations';

export const sv: GenericTranslationsObject = {
    $schema: './translation-schema.json',
    'payload-phone-number-plugin': {
        phoneNumberRequired: 'Telefonnummer krävs',
        invalidPhoneNumber: 'Ogiltigt telefonnummer',
        invalidPhoneNumberFormat: 'Ogiltigt telefonnummerformat för landet',
        phoneNumberMustBeString: 'Telefonnummer måste vara en textsträng',
        phoneNumberCountryNotAllowed: 'Telefonnummer måste vara från ett av de tillåtna länderna',
    },
};
