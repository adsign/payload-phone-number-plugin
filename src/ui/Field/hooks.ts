import { useEffect, useMemo, useRef, useState } from 'react';

import type { OptionObject } from 'payload';

import type { PhoneNumberValue, RegionCode } from '../../types.js';
import { defaults } from '../../defaults.js';
import { extractE164FromValue, parseE164ToNationalFormat, formatToNationalAsYouType, convertToE164, parseInternationalNumber } from './helpers.js';

import { countries } from '../../utilities/countries.js';

export function useSelectInputFocus({ isSelectOpen }: { isSelectOpen: boolean }) {
    // Refs need to be HTMLDivElement since Payload UI components don't forward refs
    const selectContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSelectOpen && selectContainerRef.current) {
            const input = selectContainerRef.current.querySelector('input');
            input?.focus();
        }
    }, [isSelectOpen]);

    return { selectContainerRef };
}

export function useHandlePhoneNumberPaste({ setRegionCode, setPhoneNumberInputValue }: { setRegionCode: (regionCode: RegionCode) => void; setPhoneNumberInputValue: (inputValue: string) => void }) {
    // Refs need to be HTMLDivElement since Payload UI components don't forward refs
    const phoneInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const inputElement = phoneInputContainerRef.current?.querySelector('input');
        if (!inputElement) return;

        const handlePasteEvent = (e: ClipboardEvent) => {
            const pastedText = e.clipboardData?.getData('text');
            if (!pastedText) return;

            const parsed = parseInternationalNumber(pastedText);
            if (parsed && parsed.regionCode) {
                e.preventDefault();
                setRegionCode(parsed.regionCode);
                setPhoneNumberInputValue(parsed.national);
            }
        };

        inputElement.addEventListener('paste', handlePasteEvent);
        return () => {
            inputElement.removeEventListener('paste', handlePasteEvent);
        };
    }, [setRegionCode, setPhoneNumberInputValue]);

    return { phoneInputContainerRef };
}

export function usePhoneNumberField({
    value,
    setValue,
    formInitializing,
    defaultRegionCode,
    allowedRegionCodes,
    countryOptions,
}: {
    value: PhoneNumberValue;
    setValue: (value: string) => void;
    formInitializing: boolean;
    defaultRegionCode?: RegionCode;
    allowedRegionCodes?: RegionCode[];
    countryOptions: OptionObject[];
}) {
    // Prevent re-initializing the phone input more than once
    const isInitializedRef = useRef<boolean>(false);
    // Track if user has interacted with the field (to avoid marking form dirty on load)
    const hasUserInteractedRef = useRef<boolean>(false);

    // Value can be either string or object based on afterRead hook, so always extract E.164 string to avoid issues
    const e164Value = extractE164FromValue(value);

    const determineInitialRegionCode = () => {
        if (e164Value) {
            const parsedPhoneNumber = parseE164ToNationalFormat(e164Value);
            if (parsedPhoneNumber?.regionCode) {
                return parsedPhoneNumber.regionCode;
            }
        }
        return defaultRegionCode || allowedRegionCodes?.[0] || defaults.defaultCountry;
    };

    const [regionCode, setRegionCodeInternal] = useState<RegionCode>(determineInitialRegionCode);
    const [phoneNumberInputValue, setPhoneNumberInputValueInternal] = useState<string>('');

    // Wrappers that track user interaction
    const setRegionCode = (value: RegionCode) => {
        hasUserInteractedRef.current = true;
        setRegionCodeInternal(value);
    };
    const setPhoneNumberInputValue = (value: string) => {
        hasUserInteractedRef.current = true;
        setPhoneNumberInputValueInternal(value);
    };

    const filteredCountryOptions = useMemo(() => {
        const regions = allowedRegionCodes?.length ? allowedRegionCodes : countries.map((country) => country.regionCode);
        return countryOptions.filter((option) => regions.includes(option.value as RegionCode));
    }, [allowedRegionCodes, countryOptions]);

    const currentCountry = useMemo(() => {
        return countries.find((country) => country.regionCode === regionCode);
    }, [regionCode]);

    const hasOnlyOneRegionCode = useMemo(() => {
        return filteredCountryOptions.length === 1;
    }, [filteredCountryOptions]);

    const nationalFormatInputAsYouType = useMemo(() => formatToNationalAsYouType(phoneNumberInputValue, regionCode), [phoneNumberInputValue, regionCode]);

    // Determine what to show in the input field
    const phoneNumberInputDisplayValue = useMemo(() => {
        if (nationalFormatInputAsYouType) return nationalFormatInputAsYouType;
        if (e164Value) {
            const parsedPhoneNumber = parseE164ToNationalFormat(e164Value);
            return parsedPhoneNumber?.national || e164Value;
        }
        return '';
    }, [nationalFormatInputAsYouType, e164Value]);

    // Initialize input value from E.164 value on first render to avoid client side jumps
    // Uses internal setters to avoid marking as user interaction
    useEffect(() => {
        if (!isInitializedRef.current && e164Value && !phoneNumberInputValue) {
            const parsedPhoneNumber = parseE164ToNationalFormat(e164Value);
            if (parsedPhoneNumber?.regionCode) {
                setRegionCodeInternal(parsedPhoneNumber.regionCode);
                setPhoneNumberInputValueInternal(parsedPhoneNumber.national);
            }
            isInitializedRef.current = true;
        }
    }, [e164Value, phoneNumberInputValue]);

    // Update E.164 value when phoneNumberInputValue or regionCode changes
    // Only runs after user has interacted with the field to avoid marking form dirty on load
    useEffect(() => {
        if (formInitializing) return;
        if (!hasUserInteractedRef.current) return;

        if (!phoneNumberInputValue.trim()) {
            if (e164Value !== '') setValue('');
            return;
        }

        const convertedPhoneNumber = convertToE164(nationalFormatInputAsYouType, regionCode);
        if (convertedPhoneNumber) {
            if (convertedPhoneNumber.detectedRegion && convertedPhoneNumber.detectedRegion !== regionCode) {
                setRegionCodeInternal(convertedPhoneNumber.detectedRegion);
            }
            if (convertedPhoneNumber.e164 !== e164Value) {
                setValue(convertedPhoneNumber.e164);
            }
        } else {
            if (phoneNumberInputValue !== e164Value) {
                setValue(phoneNumberInputValue);
            }
        }
    }, [phoneNumberInputValue, e164Value, nationalFormatInputAsYouType, regionCode, formInitializing, setValue]);

    return {
        regionCode,
        setRegionCode,
        setPhoneNumberInputValue,
        phoneNumberInputDisplayValue,
        filteredCountryOptions,
        currentCountry,
        hasOnlyOneRegionCode,
    };
}
