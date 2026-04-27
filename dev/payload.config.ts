import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import path from 'path';
import { buildConfig } from 'payload';
import { en } from 'payload/i18n/en';
import { nb } from 'payload/i18n/nb';
import { phoneNumberPlugin, phoneNumberField } from 'payload-phone-number-plugin';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { testEmailAdapter } from './helpers/testEmailAdapter.js';
import { seed } from './seed.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
    process.env.ROOT_DIR = dirname;
}

const buildConfigWithMemoryDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        const memoryDB = await MongoMemoryReplSet.create({
            replSet: {
                count: 3,
                dbName: 'payloadmemory',
            },
        });

        process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`;
    }

    return buildConfig({
        admin: {
            importMap: {
                baseDir: path.resolve(dirname),
            },
        },
        collections: [
            {
                admin: {
                    useAsTitle: 'name',
                },
                slug: 'employees',
                fields: [
                    {
                        type: 'row',
                        admin: {
                            style: { marginBottom: '100px' },
                        },
                        fields: [
                            phoneNumberField({
                                name: 'phoneNumberForUIScreenshots',
                                label: 'Phone Number',
                                //required: true,
                                allowedCountries: ['NO'],
                                admin: {
                                    width: '50%',
                                },
                            }),
                            phoneNumberField({
                                name: 'phoneNumberForUIScreenshotsWithMultiple',
                                label: 'Phone Number',
                                //required: true,
                                defaultCountry: 'US',
                                allowedCountries: ['NO', 'US'],
                                admin: {
                                    width: '50%',
                                },
                            }),
                        ],
                    },
                    {
                        type: 'row',
                        fields: [
                            {
                                name: 'name',
                                label: 'Name',
                                type: 'text',
                                required: true,
                                admin: {
                                    width: '50%',
                                },
                            },
                            phoneNumberField({
                                name: 'phoneNumber',
                                label: 'Phone Number',
                                required: true,
                                allowedCountries: ['NO'],
                                admin: {
                                    width: '50%',
                                },
                            }),
                        ],
                    },
                    phoneNumberField({
                        name: 'phoneNumberNotRequired',
                        label: 'Phone Number (Multiple Countries)',
                        allowedCountries: ['NO', 'SE', 'DK', 'US'],
                        admin: {
                            description: 'This is a field description',
                            cellDisplayFormat: 'national',
                            countryPrefixDisplayFormat: 'callingCode',
                        },
                    }),
                    phoneNumberField({
                        name: 'phoneNumberAnyCountry',
                        label: 'Phone Number (Any Country)',
                    }),
                    phoneNumberField({
                        name: 'phoneNumberAnyCountryWithFlagPrefix',
                        label: 'Phone Number (With Flag Prefix)',
                        admin: {
                            countryPrefixDisplayFormat: 'flagEmoji',
                        },
                    }),
                    phoneNumberField({
                        name: 'phoneNumberReadOnly',
                        label: 'Phone Number (Read Only)',
                        admin: {
                            readOnly: true,
                        },
                    }),
                    phoneNumberField({
                        name: 'phoneNumberNoAccess',
                        label: 'Phone Number (No Access)',
                        access: {
                            update: () => false,
                        },
                    }),
                    {
                        name: 'checkbox',
                        label: 'Checkbox in sidebar',
                        type: 'checkbox',
                        admin: {
                            position: 'sidebar',
                        },
                    },
                ],
            },
        ],
        db: mongooseAdapter({
            ensureIndexes: true,
            url: process.env.DATABASE_URI || '',
        }),
        editor: lexicalEditor(),
        email: testEmailAdapter,
        onInit: async (payload) => {
            await seed(payload);
        },
        plugins: [
            phoneNumberPlugin({
                allowedCountries: ['NO', 'SE', 'DK', 'US'],
            }),
        ],
        secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
        i18n: {
            fallbackLanguage: 'en',
            supportedLanguages: { en, nb },
        },
        sharp,
        typescript: {
            outputFile: path.resolve(dirname, 'payload-types.ts'),
        },
    });
};

export default buildConfigWithMemoryDB();
