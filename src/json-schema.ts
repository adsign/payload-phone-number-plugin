import type { JSONSchema4 } from 'json-schema';

export const PhoneNumber: JSONSchema4 = {
    title: 'PhoneNumber',
    type: 'object',
    properties: {
        e164: { type: 'string', description: 'Phone number in E.164 format. Useful for using in `tel:` links.' },
        regionCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code.\n\n@see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2. \n@example "NO"' },
        callingCode: { type: 'string', description: 'International calling code. \n\n@example "+47"' },
        national: { type: 'string', description: 'National format of the phone number.' },
        international: { type: 'string', description: 'International format of the phone number.' },
    },
    required: ['e164', 'regionCode', 'callingCode', 'national', 'international'],
    additionalProperties: false,
};
