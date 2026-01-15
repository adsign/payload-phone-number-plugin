import type { Locale, SanitizedLocalizationConfig } from 'payload';

// Note: this was copied from Payload as it's not exported
export function isFieldRTL({
    fieldLocalized,
    fieldRTL,
    locale,
    localizationConfig,
}: {
    fieldLocalized?: boolean;
    fieldRTL?: boolean;
    locale: Locale;
    localizationConfig?: SanitizedLocalizationConfig;
}): boolean {
    const hasMultipleLocales = locale && localizationConfig?.locales && localizationConfig.locales.length > 1;
    const isCurrentLocaleDefaultLocale = locale?.code === localizationConfig?.defaultLocale;

    return (fieldRTL !== false && locale?.rtl === true && (fieldLocalized || (!fieldLocalized && !hasMultipleLocales) || (!fieldLocalized && isCurrentLocaleDefaultLocale))) || fieldRTL === true;
}
