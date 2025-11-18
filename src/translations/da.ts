import type { GenericTranslationsObject } from '@payloadcms/translations';

export const da: GenericTranslationsObject = {
    $schema: './translation-schema.json',
    'payload-phone-number-plugin': {
        phoneNumberRequired: 'Telefonnummer er påkrævet',
        invalidPhoneNumber: 'Ugyldigt telefonnummer',
        invalidPhoneNumberFormat: 'Ugyldigt telefonnummerformat for landet',
        phoneNumberMustBeString: 'Telefonnummer skal være en tekststreng',
        phoneNumberCountryNotAllowed: 'Telefonnummer skal være fra et af de tilladte lande',
    },
};
