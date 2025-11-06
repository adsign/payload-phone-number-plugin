import type { Config, Plugin } from 'payload';

import { deepMergeSimple } from 'payload/shared';

import type { PhoneNumberPluginOptions } from './types.js';

import { translations } from './translations/index.js';

import { PhoneNumber } from './json-schema.js';

const phoneNumberPlugin =
    (pluginOptions?: PhoneNumberPluginOptions): Plugin =>
    (incomingConfig: Config): Config => {
        const config: Config = {
            ...incomingConfig,
            i18n: {
                ...incomingConfig.i18n,
                translations: deepMergeSimple(translations, incomingConfig.i18n?.translations ?? {}),
            },
            typescript: {
                ...incomingConfig.typescript,
                schema: [
                    ...(incomingConfig.typescript?.schema || []),
                    ({ jsonSchema }) => {
                        jsonSchema.definitions = {
                            ...jsonSchema.definitions,
                            PhoneNumber,
                        };
                        return jsonSchema;
                    },
                ],
            },
        };

        return config;
    };

export { phoneNumberPlugin };
export { phoneNumberField, type PhoneNumberField } from './fields/phoneNumber.js';
