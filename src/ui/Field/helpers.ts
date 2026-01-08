import { AsYouType, parsePhoneNumber } from 'libphonenumber-js/max';

import type { PhoneNumberValue, RegionCode } from '../../types.js';

export function extractE164FromValue(value: PhoneNumberValue) {
    return typeof value === 'object' && value !== null ? value.e164 : value || '';
}

export function parseE164ToNationalFormat(e164PhoneNumber: string): { regionCode: RegionCode | null; national: string } | null {
    try {
        const phoneNumber = parsePhoneNumber(e164PhoneNumber);

        const regionCode = phoneNumber.country || null;
        const national = phoneNumber.formatNational();

        return { regionCode, national };
    } catch {
        return null;
    }
}

export function formatToNationalAsYouType(input: string, regionCode: RegionCode) {
    const formatter = new AsYouType(regionCode);
    const nationalFormat = formatter.input(input.replace(/\D/g, ''));

    return nationalFormat;
}

export function convertToE164(nationalPhoneNumber: string, regionCode: RegionCode): { e164: string; detectedRegion: RegionCode | null } | null {
    try {
        const phoneNumber = parsePhoneNumber(nationalPhoneNumber, regionCode);

        const e164 = phoneNumber.number;
        const detectedRegion = phoneNumber.country || null;

        return { e164, detectedRegion };
    } catch {
        return null;
    }
}

export function extractDigitsWithPlus(input: string) {
    const hasPlus = input.trim().startsWith('+');
    const digits = input.replace(/\D/g, '');
    return hasPlus ? `+${digits}` : digits;
}

export function parseInternationalNumber(input: string): { regionCode: RegionCode | null; national: string } | null {
    try {
        const cleanInput = extractDigitsWithPlus(input);
        const phoneNumber = parsePhoneNumber(cleanInput);

        const regionCode = phoneNumber.country || null;
        const national = phoneNumber.formatNational();

        return { regionCode, national };
    } catch {
        return null;
    }
}
