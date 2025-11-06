import type { GenericTranslationsObject } from '@payloadcms/translations';

export const nb: GenericTranslationsObject = {
    $schema: './translation-schema.json',
    'payload-phone-number-plugin': {
        phoneNumberRequired: 'Telefonnummer er påkrevd',
        invalidPhoneNumber: 'Ugyldig telefonnummer',
        invalidPhoneNumberFormat: 'Ugyldig telefonnummerformat for valgt land',
        phoneNumberMustBeString: 'Telefonnummer må være en tekststreng',
        phoneNumberCountryNotAllowed: 'Telefonnummer må være fra et av de tillatte landene',
    },
};
