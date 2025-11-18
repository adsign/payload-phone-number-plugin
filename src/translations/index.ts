import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations';

import { en } from './en.js';
import { nb } from './nb.js';
import { sv } from './sv.js';
import { da } from './da.js';

export const translations = {
    en,
    nb,
    sv,
    da,
};

export type PayloadPhoneNumberPluginTranslations = GenericTranslationsObject;

export type PayloadPhoneNumberPluginTranslationKeys = NestedKeysStripped<PayloadPhoneNumberPluginTranslations>;
