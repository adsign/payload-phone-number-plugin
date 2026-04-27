import type { Payload } from 'payload';
import { getPayload } from 'payload';

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
                phoneNumber: '+4745360001',
            },
        });

        expect(employee.name).toBe('Test');
        expect(employee.phoneNumber).toEqual({
            e164: '+4745360001',
            regionCode: 'NO',
            callingCode: '+47',
            national: '45 36 00 01',
            international: '+47 45 36 00 01',
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
                phoneNumber: '+4745360001',
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
                phoneNumber: '+4745360001',
                phoneNumberAnyCountry: '+4745360001',
            },
        });

        expect(employee.phoneNumberAnyCountry).toMatchObject({
            e164: '+4745360001',
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
                phoneNumber: '+4745360001',
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
                phoneNumber: '+4745360001',
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
                    phoneNumber: '+4745360001',
                    phoneNumberAnyCountry: '+4915123456789',
                },
            })
        ).rejects.toThrow();
    });

    test('returns raw phone number string when requested via context', async () => {
        const phoneNumber = '+4745360001';

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
