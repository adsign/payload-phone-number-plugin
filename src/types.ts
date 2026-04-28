import type { GeneratedTypes } from 'payload';
import type { CountryCode } from 'libphonenumber-js';

export type PhoneNumberPluginOptions = {
    /**
     * Restricts every `phoneNumberField` in the project to these country region codes.
     *
     * If not used, fields will accept all country region codes.
     *
     * Expects an array of `ISO 3166-1 alpha-2` country codes.
     *
     * @example ['US', 'NO', 'SE']
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     */
    allowedCountries?: RegionCode[];
    /**
     * Project-wide default country.
     *
     * Field-level `defaultCountry` overrides this.
     *
     * Expects an `ISO 3166-1 alpha-2` country code.
     *
     * @default 'US'
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     */
    defaultCountry?: ConfiguredRegionCode;
    admin?: {
        /**
         * Default for `admin.cellDisplayFormat`.
         *
         * Field-level value overrides this.
         *
         * @default 'international'
         */
        cellDisplayFormat?: CellDisplayFormat;
        /**
         * Default for `admin.countryPrefixDisplayFormat`.
         *
         * Field-level value overrides this.
         *
         * @default 'flagEmojiAndCallingCode'
         */
        countryPrefixDisplayFormat?: CountryPrefixDisplayFormat;
    };
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
