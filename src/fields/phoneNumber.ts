import type { Field, TextField } from 'payload';

import type { JSONSchema4 } from 'json-schema';

import { createPhoneNumberValidator } from '../utilities/validate.js';
import { getPhoneNumberDetails } from '../utilities/getPhoneNumberDetails.js';

import type { RegionCode } from '../types.js';

type PhoneNumberField<T extends RegionCode[] | undefined = undefined> = Omit<TextField, 'type' | 'hasMany' | 'typescriptSchema' | 'maxRows' | 'minRows' | 'admin'> & {
    /**
     * The default country region code for the field
     *
     * If `allowedCountries` is specified, `defaultCountry` must be one of the allowed countries.
     *
     * Expects a `ISO 3166-1 alpha-2` country code.
     * @default 'US'
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     */
    defaultCountry?: T extends RegionCode[] ? T[number] : RegionCode;
    /**
     * Specifies the country region codes that the field will accept, restricting user selection to these countries.
     *
     * If not used, the field will show all country region codes.
     *
     * Expects an array of `ISO 3166-1 alpha-2` country codes.
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     * @example ['US', 'NO', 'SE']
     */
    allowedCountries?: T;
    /**
     * Admin configuration for the field
     */
    admin?: TextField['admin'] & {
        /**
         * The format to display phone numbers in table cells
         *
         * Options:
         * - `e164`: E.164 format (e.g., +4712345678)
         * - `national`: National format (e.g., 12 34 56 78)
         * - `international`: International format (e.g., +47 12 34 56 78)
         *
         * @default 'international'
         */
        cellDisplayFormat?: 'e164' | 'national' | 'international';
    };
};

/**
 * Phone Number Field for Payload CMS
 *
 * @example
 * ```ts
 * import { phoneNumberField } from 'payload-phone-number-plugin';
 *
 * const Employees = {
 *   slug: 'employees',
 *   fields: [
 *     phoneNumberField({
 *       name: 'phoneNumber',
 *       label: 'Phone Number',
 *       required: true,
 *     }),
 *   ],
 * };
 * ```
 */
const phoneNumberField = <T extends RegionCode[] | undefined = undefined>({ required, defaultCountry, allowedCountries, label, admin, ...props }: PhoneNumberField<T>): Field => {
    const field: Field = {
        ...props,
        label,
        type: 'text',
        required,
        validate: createPhoneNumberValidator(allowedCountries),
        admin: {
            ...admin,
            components: {
                Field: {
                    path: 'payload-phone-number-plugin/client#PhoneNumberFieldComponent',
                    clientProps: {
                        defaultRegionCode: defaultCountry,
                        allowedRegionCodes: allowedCountries,
                    },
                },
                Cell: {
                    path: 'payload-phone-number-plugin/client#PhoneNumberCellComponent',
                    clientProps: {
                        cellDisplayFormat: admin?.cellDisplayFormat,
                    },
                },
            },
        },
        hooks: {
            beforeChange: [
                ({ value }) => {
                    if (value && typeof value === 'object' && 'e164' in value) {
                        return value.e164;
                    }
                    return value;
                },
            ],
            afterRead: [
                ({ value, context }) => {
                    if (value && typeof value === 'string' && context['phoneNumberPluginReturnRawString'] !== true) {
                        return getPhoneNumberDetails(value);
                    }
                    return value;
                },
            ],
        },
        typescriptSchema: [
            (): JSONSchema4 => {
                if (!required) {
                    return {
                        anyOf: [{ type: 'string' }, { $ref: '#/definitions/PhoneNumber' }, { type: 'null' }],
                    };
                }

                return {
                    anyOf: [{ type: 'string' }, { $ref: '#/definitions/PhoneNumber' }],
                };
            },
        ],
    };

    return field;
};

export { phoneNumberField, type PhoneNumberField };
