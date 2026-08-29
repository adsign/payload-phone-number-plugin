import type { Field, Payload } from 'payload';
import { getPayload, traverseFields } from 'payload';

import config from './payload.config.js';

import { afterAll, beforeAll, describe, expect, test } from 'vitest';

let payload: Payload;

afterAll(async () => {
    await payload.destroy();
});

beforeAll(async () => {
    payload = await getPayload({ config: await config });
});

describe('Phone Number Plugin integration tests', () => {
    test('can create employee with phone number field', async () => {
        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber: '+4740612345',
            },
        });

        expect(employee.name).toBe('Test');
        expect(employee.phoneNumber).toEqual({
            e164: '+4740612345',
            regionCode: 'NO',
            callingCode: '+47',
            national: '40 61 23 45',
            international: '+47 40 61 23 45',
        });
    });

    test('rejects invalid phone number', async () => {
        await expect(
            payload.create({
                collection: 'employees',
                data: {
                    name: 'Test',
                    phoneNumber: 'invalid-phone-number',
                },
            })
        ).rejects.toThrow();
    });

    test('can create employee without optional phone number', async () => {
        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber: '+4740612345',
                phoneNumberNotRequired: null,
            },
        });

        expect(employee.name).toBe('Test');
        expect(employee.phoneNumberNotRequired).toBeNull();
    });

    test('rejects phone number from disallowed country', async () => {
        await expect(
            payload.create({
                collection: 'employees',
                data: {
                    name: 'Test',
                    phoneNumber: '+16505553434',
                },
            })
        ).rejects.toThrow();
    });

    test('can update existing phone number from one country to another', async () => {
        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber: '+4740612345',
                phoneNumberAnyCountry: '+4740612345',
            },
        });

        expect(employee.phoneNumberAnyCountry).toMatchObject({
            e164: '+4740612345',
            regionCode: 'NO',
        });

        const updatedEmployee = await payload.update({
            collection: 'employees',
            id: employee.id,
            data: {
                phoneNumberAnyCountry: '+16505553434',
            },
        });

        expect(updatedEmployee.phoneNumberAnyCountry).toMatchObject({
            e164: '+16505553434',
            regionCode: 'US',
        });
    });

    test('accepts phone number from allowed country in multi-country field', async () => {
        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber: '+4740612345',
                phoneNumberNotRequired: '+16505553434',
            },
        });

        expect(employee.phoneNumberNotRequired).toMatchObject({
            e164: '+16505553434',
            regionCode: 'US',
        });
    });

    test('accepts phone number from any country when no restriction', async () => {
        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber: '+4740612345',
                phoneNumberAnyCountry: '+16505553434',
            },
        });

        expect(employee.phoneNumberAnyCountry).toMatchObject({
            e164: '+16505553434',
            regionCode: 'US',
        });
    });

    test('rejects phone number from country outside plugin-level allowedCountries', async () => {
        await expect(
            payload.create({
                collection: 'employees',
                data: {
                    name: 'Test',
                    phoneNumber: '+4740612345',
                    phoneNumberAnyCountry: '+4915123456789',
                },
            })
        ).rejects.toThrow();
    });

    test('applies plugin-level defaultCountry to fields that omit their own', async () => {
        const employees = payload.config.collections.find((c) => c.slug === 'employees')!;
        const clientPropsByName = new Map<string, Record<string, unknown> | undefined>();
        traverseFields({
            fields: employees.fields as Field[],
            callback: ({ field }) => {
                if (!('name' in field) || !field.name || !('type' in field) || field.type !== 'text') return;
                const fieldComponent = field.admin?.components?.Field as { clientProps?: Record<string, unknown> } | undefined;
                clientPropsByName.set(field.name, fieldComponent?.clientProps);
            },
        });

        expect(clientPropsByName.get('phoneNumberAnyCountry')?.defaultRegionCode).toBe('NO');
        expect(clientPropsByName.get('phoneNumberForUIScreenshotsWithMultiple')?.defaultRegionCode).toBe('US');
    });

    test('returns raw phone number string when requested via context', async () => {
        const phoneNumber = '+4740612345';

        const employee = await payload.create({
            collection: 'employees',
            data: {
                name: 'Test',
                phoneNumber,
            },
        });

        expect(employee.phoneNumber).toMatchObject({
            e164: phoneNumber,
        });

        const employeeWithRawPhone = await payload.findByID({
            collection: 'employees',
            id: employee.id,
            context: {
                phoneNumberPluginReturnRawValue: true,
            },
        });

        expect(employeeWithRawPhone.phoneNumber).toBe(phoneNumber);
    });
});
