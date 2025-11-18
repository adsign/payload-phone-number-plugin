import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations';

import { en } from './en.js';
import { nb } from './nb.js';
import { sv } from './sv.js';

export const translations = {
    en,
    nb,
    sv,
};

export type PayloadPhoneNumberPluginTranslations = GenericTranslationsObject;

export type PayloadPhoneNumberPluginTranslationKeys = NestedKeysStripped<PayloadPhoneNumberPluginTranslations>;
