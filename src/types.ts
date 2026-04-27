import type { GeneratedTypes } from 'payload';
import type { CountryCode } from 'libphonenumber-js';

export type PhoneNumberPluginOptions = {
    /**
     * Restricts every `phoneNumberField` in the project to these country region codes.
     *
     * If not used, fields will accept all country region codes.
     *
     * Expects an array of `ISO 3166-1 alpha-2` country codes.
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     * @example ['US', 'NO', 'SE']
     */
    allowedCountries?: RegionCode[];
    /**
     * Project-wide default country. Each `phoneNumberField` that omits its own
     * `defaultCountry` falls back to this.
     *
     * Expects an `ISO 3166-1 alpha-2` country code.
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     * @example 'NO'
     */
    defaultCountry?: ConfiguredRegionCode;
};

export type ConfiguredRegionCode = GeneratedTypes extends { 'phone-number-plugin': { allowedCountry: infer C } } ? (C extends RegionCode ? C : RegionCode) : RegionCode;

export type PhoneNumberValue = string | PhoneNumber;

export type PhoneNumber = {
    e164: string;
    regionCode: string;
    callingCode: string;
    international: string;
    national: string;
};

export type CellDisplayFormat = 'e164' | 'national' | 'international';

export type CountryPrefixDisplayFormat = 'flagEmoji' | 'callingCode' | 'flagEmojiAndCallingCode';

export type Country = {
    callingCode: `+${string}`;
    emoji: string;
    name: {
        international: string;
    };
    regionCode: RegionCode;
};

export type Defaults = {
    /**
     * @default 'US'
     */
    defaultCountry: RegionCode;
    /**
     * @default 'international'
     */
    cellDisplayFormat: CellDisplayFormat;
    /**
     * @default 'flagEmojiAndCallingCode'
     */
    countryPrefixDisplayFormat: CountryPrefixDisplayFormat;
};

export type RegionCode = CountryCode;
