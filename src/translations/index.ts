import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations';

import { en } from './en.js';
import { nb } from './nb.js';

export const translations = {
    en,
    nb,
};

export type PayloadPhoneNumberPluginTranslations = GenericTranslationsObject;

export type PayloadPhoneNumberPluginTranslationKeys = NestedKeysStripped<PayloadPhoneNumberPluginTranslations>;
