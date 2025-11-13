import * as libphonenumber from 'google-libphonenumber';

import type { PhoneNumberValue, RegionCode } from '../../types.js';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const AsYouTypeFormatter = libphonenumber.AsYouTypeFormatter;
const PNF = libphonenumber.PhoneNumberFormat;

export function extractE164FromValue(value: PhoneNumberValue) {
    return typeof value === 'object' && value !== null ? value.e164 : value || '';
}

export function parseE164ToNationalFormat(e164PhoneNumber: string): { regionCode: RegionCode | null; national: string } | null {
    try {
        const number = phoneUtil.parse(e164PhoneNumber);
        const regionCode = phoneUtil.getRegionCodeForNumber(number) || null;
        const national = phoneUtil.format(number, PNF.NATIONAL);

        return { regionCode, national };
    } catch {
        return null;
    }
}

export function formatToNationalAsYouType(input: string, regionCode: RegionCode) {
    const formatter = new AsYouTypeFormatter(regionCode);
    let nationalFormat = '';
    for (const char of input.replace(/\D/g, '')) {
        nationalFormat = formatter.inputDigit(char);
    }

    return nationalFormat;
}

export function convertToE164(nationalPhoneNumber: string, regionCode: RegionCode): { e164: string; detectedRegion: RegionCode | null } | null {
    try {
        const number = phoneUtil.parseAndKeepRawInput(nationalPhoneNumber, regionCode);
        const e164 = phoneUtil.format(number, PNF.E164);
        const detectedRegion = phoneUtil.getRegionCodeForNumber(number) || null;

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
        const number = phoneUtil.parse(cleanInput);
        const regionCode = phoneUtil.getRegionCodeForNumber(number) || null;
        const national = phoneUtil.format(number, PNF.NATIONAL);

        return { regionCode, national };
    } catch {
        return null;
    }
}
