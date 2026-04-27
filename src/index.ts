import type { Config, Field, Plugin } from 'payload';

import { deepMergeSimple } from 'payload/shared';
import { traverseFields } from 'payload';

import type { PhoneNumberPluginOptions, RegionCode } from './types.js';

import { translations } from './translations/index.js';

import { PhoneNumber } from './json-schema.js';
import { createPhoneNumberValidator } from './utilities/validate.js';

const applyPluginAllowedCountries = (fields: Field[], pluginAllowedCountries: RegionCode[]): void => {
    traverseFields({
        fields,
        callback: ({ field }) => {
            if (!('type' in field) || field.type !== 'text') return;
            const marker = field.custom?.['phone-number-plugin'] as { allowedCountries?: RegionCode[] } | undefined;
            if (!marker || marker.allowedCountries !== undefined) return;

            field.validate = createPhoneNumberValidator(pluginAllowedCountries);
            const fieldComponent = field.admin?.components?.Field as { clientProps?: Record<string, unknown> } | undefined;
            if (fieldComponent) {
                fieldComponent.clientProps = { ...fieldComponent.clientProps, allowedRegionCodes: pluginAllowedCountries };
            }
        },
    });
};

const phoneNumberPlugin =
    (pluginOptions?: PhoneNumberPluginOptions): Plugin =>
    (incomingConfig: Config): Config => {
        const pluginAllowedCountries = pluginOptions?.allowedCountries;

        if (pluginAllowedCountries && pluginAllowedCountries.length > 0) {
            for (const collection of incomingConfig.collections ?? []) applyPluginAllowedCountries(collection.fields, pluginAllowedCountries);
            for (const global of incomingConfig.globals ?? []) applyPluginAllowedCountries(global.fields, pluginAllowedCountries);
        }

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

                        const allowedCountries = pluginOptions?.allowedCountries;
                        if (allowedCountries && allowedCountries.length > 0) {
                            jsonSchema.properties = {
                                ...jsonSchema.properties,
                                'phone-number-plugin': {
                                    type: 'object',
                                    properties: {
                                        allowedCountry: { type: 'string', enum: allowedCountries },
                                    },
                                    required: ['allowedCountry'],
                                    additionalProperties: false,
                                },
                            };
                            const existing = Array.isArray(jsonSchema.required) ? jsonSchema.required : [];
                            jsonSchema.required = Array.from(new Set([...existing, 'phone-number-plugin']));
                        }

                        return jsonSchema;
                    },
                ],
            },
        };

        return config;
    };

export { phoneNumberPlugin };
export { phoneNumberField, type PhoneNumberField } from './fields/phoneNumber.js';
