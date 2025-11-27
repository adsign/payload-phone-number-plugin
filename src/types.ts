import type { RegionCode } from 'google-libphonenumber';

export type PhoneNumberPluginOptions = {};

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

export type { RegionCode };
