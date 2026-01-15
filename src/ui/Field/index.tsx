'use client';

import type { OptionObject, TextFieldClientProps } from 'payload';
import { Select, TextInput, FieldDescription, useField, useConfig, useLocale } from '@payloadcms/ui';
import { mergeFieldStyles } from '@payloadcms/ui/shared';

import type { ChangeEvent, FC } from 'react';
import { useMemo, useState } from 'react';

import clsx from 'clsx';

import type { PhoneNumberValue, RegionCode, CountryPrefixDisplayFormat } from '../../types.js';
import { defaults } from '../../defaults.js';
import { usePhoneNumberField, useSelectInputFocus, useHandlePhoneNumberPaste } from './hooks.js';

import { countries } from '../../utilities/countries.js';
import { isFieldRTL } from '../../utilities/isFieldRTL.js';

import './index.scss';

type PhoneNumberFieldProps = {
    allowedRegionCodes?: RegionCode[];
    defaultRegionCode?: RegionCode;
    countryPrefixDisplayFormat?: CountryPrefixDisplayFormat;
} & TextFieldClientProps;

const countryOptions: OptionObject[] = countries.map((country) => ({
    label: `${country.name.international} (${country.callingCode})`,
    value: country.regionCode,
}));

export const PhoneNumberFieldComponent: FC<PhoneNumberFieldProps> = ({
    allowedRegionCodes,
    defaultRegionCode,
    countryPrefixDisplayFormat = defaults.countryPrefixDisplayFormat,
    field,
    path: pathFromProps,
    readOnly,
}) => {
    const { name, label, required, localized } = field;
    const locale = useLocale();
    const {
        config: { localization: localizationConfig },
    } = useConfig();

    const renderRTL = isFieldRTL({
        fieldLocalized: localized,
        fieldRTL: field.admin?.rtl,
        locale,
        localizationConfig: localizationConfig || undefined,
    });

    const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

    const styles = useMemo(() => mergeFieldStyles(field), [field]);

    const path = pathFromProps ?? name;
    const { formInitializing, setValue, value, disabled, showError } = useField<PhoneNumberValue>({ path });
    const isDisabled = readOnly || disabled || field.admin?.readOnly;

    const { regionCode, setRegionCode, setPhoneNumberInputValue, phoneNumberInputDisplayValue, filteredCountryOptions, currentCountry, hasOnlyOneRegionCode } = usePhoneNumberField({
        value,
        setValue,
        formInitializing,
        defaultRegionCode,
        allowedRegionCodes,
        countryOptions,
    });

    const { selectContainerRef } = useSelectInputFocus({ isSelectOpen });
    const { phoneInputContainerRef } = useHandlePhoneNumberPaste({ setRegionCode, setPhoneNumberInputValue });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumberInputValue(e.target.value);
    };

    const countryPrefix = () => {
        switch (countryPrefixDisplayFormat) {
            case 'flagEmoji':
                return <span className="phone-number__emoji">{currentCountry?.emoji}</span>;
            case 'callingCode':
                return <span className="phone-number__country-prefix">{currentCountry?.callingCode}</span>;
            case 'flagEmojiAndCallingCode':
            default:
                return (
                    <>
                        <span className="phone-number__emoji">{currentCountry?.emoji}</span>
                        <span className="phone-number__country-prefix">{currentCountry?.callingCode}</span>
                    </>
                );
        }
    };

    return (
        <div
            className={clsx('field-type', 'text', {
                'phone-number__region-code-select-open': isSelectOpen,
                'phone-number__has-only-one-region-code': hasOnlyOneRegionCode,
                'phone-number__show-flag-emoji-and-calling-code': countryPrefixDisplayFormat === 'flagEmojiAndCallingCode',
            })}
            style={styles}>
            <div className="phone-number__input-container" ref={phoneInputContainerRef}>
                <TextInput
                    BeforeInput={
                        hasOnlyOneRegionCode ? (
                            <div className="phone-number__select-region-code-button">
                                <div className="phone-number__country-prefix-container">{countryPrefix()}</div>
                            </div>
                        ) : (
                            <button
                                className="phone-number__select-region-code-button phone-number__select-region-code-button-with-dropdown"
                                disabled={isDisabled}
                                onFocus={() => setIsSelectOpen(true)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setIsSelectOpen(!isSelectOpen);
                                }}
                                type="button">
                                <div className="phone-number__country-prefix-container">{countryPrefix()}</div>
                                <svg height="8" viewBox="0 0 12 8" width="12" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 1.48438L5.99958 6.77894L0.999163 1.48437" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.75" strokeWidth="1.8" />
                                </svg>
                            </button>
                        )
                    }
                    className="phone-number__input-field"
                    label={label}
                    onChange={handleInputChange}
                    path={path}
                    readOnly={isDisabled || formInitializing}
                    required={required}
                    rtl={renderRTL}
                    showError={showError}
                    value={phoneNumberInputDisplayValue}
                />
                {!formInitializing && (
                    <div ref={selectContainerRef}>
                        <Select
                            className="phone-number__region-code-select"
                            disabled={isDisabled}
                            isClearable={false}
                            isSearchable
                            menuIsOpen={isSelectOpen}
                            onChange={(option) => {
                                if (option && !Array.isArray(option)) {
                                    setRegionCode(option.value as RegionCode);
                                    setIsSelectOpen(false);
                                    phoneInputContainerRef.current?.querySelector('input')?.focus();
                                }
                            }}
                            onMenuClose={() => setIsSelectOpen(false)}
                            onMenuOpen={() => setIsSelectOpen(true)}
                            options={filteredCountryOptions}
                            value={filteredCountryOptions.find((option) => option.value === regionCode)}
                        />
                    </div>
                )}
            </div>
            {field.admin?.description && <FieldDescription className="field-description" description={field.admin.description} path={path} />}
        </div>
    );
};
