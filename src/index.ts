import type { Config, Field, Plugin } from 'payload';

import { deepMergeSimple } from 'payload/shared';
import { traverseFields } from 'payload';

import type { CellDisplayFormat, CountryPrefixDisplayFormat, PhoneNumberPluginOptions, RegionCode } from './types.js';

import { translations } from './translations/index.js';

import { PhoneNumber } from './json-schema.js';
import { createPhoneNumberValidator } from './utilities/validate.js';

type PhoneNumberFieldMarker = {
    allowedCountries?: RegionCode[];
    defaultCountry?: RegionCode;
    cellDisplayFormat?: CellDisplayFormat;
    countryPrefixDisplayFormat?: CountryPrefixDisplayFormat;
};

const applyPluginDefaults = (fields: Field[], pluginOptions: PhoneNumberPluginOptions | undefined): void => {
    const pluginAllowedCountries = pluginOptions?.allowedCountries;
    const pluginDefaultCountry = pluginOptions?.defaultCountry;
    const pluginCellFormat = pluginOptions?.admin?.cellDisplayFormat;
    const pluginPrefixFormat = pluginOptions?.admin?.countryPrefixDisplayFormat;

    traverseFields({
        fields,
        callback: ({ field }) => {
            if (!('type' in field) || field.type !== 'text') return;
            const marker = field.custom?.['phone-number-plugin'] as PhoneNumberFieldMarker | undefined;
            if (!marker) return;

            const fieldComponent = field.admin?.components?.Field as { clientProps?: Record<string, unknown> } | undefined;
            const cellComponent = field.admin?.components?.Cell as { clientProps?: Record<string, unknown> } | undefined;

            if (marker.allowedCountries === undefined && pluginAllowedCountries && pluginAllowedCountries.length > 0) {
                field.validate = createPhoneNumberValidator(pluginAllowedCountries);
                if (fieldComponent) {
                    fieldComponent.clientProps = { ...fieldComponent.clientProps, allowedRegionCodes: pluginAllowedCountries };
                }
            }

            if (marker.defaultCountry === undefined && pluginDefaultCountry && fieldComponent) {
                fieldComponent.clientProps = { ...fieldComponent.clientProps, defaultRegionCode: pluginDefaultCountry };
            }

            if (marker.cellDisplayFormat === undefined && pluginCellFormat && cellComponent) {
                cellComponent.clientProps = { ...cellComponent.clientProps, cellDisplayFormat: pluginCellFormat };
            }

            if (marker.countryPrefixDisplayFormat === undefined && pluginPrefixFormat && fieldComponent) {
                fieldComponent.clientProps = { ...fieldComponent.clientProps, countryPrefixDisplayFormat: pluginPrefixFormat };
            }
        },
    });
};

/**
 * Phone Number Plugin for Payload CMS.
 *
 * See {@link PhoneNumberPluginOptions} for available options.
 *
 * @example
 * ```ts
 * import { phoneNumberPlugin } from 'payload-phone-number-plugin';
 *
 * export default buildConfig({
 *   plugins: [
 *     phoneNumberPlugin({
 *       allowedCountries: ['NO', 'SE', 'DK', 'US'],
 *       defaultCountry: 'NO',
 *     }),
 *   ],
 * });
 * ```
 */
const phoneNumberPlugin =
    (pluginOptions?: PhoneNumberPluginOptions): Plugin =>
    (incomingConfig: Config): Config => {
        for (const collection of incomingConfig.collections ?? []) applyPluginDefaults(collection.fields, pluginOptions);
        for (const global of incomingConfig.globals ?? []) applyPluginDefaults(global.fields, pluginOptions);

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
