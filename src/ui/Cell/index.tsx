'use client';

import type { DefaultCellComponentProps, TextFieldClient } from 'payload';
import { getTranslation } from '@payloadcms/translations';
import { useTranslation } from '@payloadcms/ui';

import type { FC } from 'react';

import type { PhoneNumberValue, CellDisplayFormat } from '../../types.js';

type PhoneNumberCellProps = DefaultCellComponentProps<TextFieldClient, PhoneNumberValue> & {
    cellDisplayFormat?: CellDisplayFormat;
};

export const PhoneNumberCellComponent: FC<PhoneNumberCellProps> = ({ cellData, cellDisplayFormat = 'international', field }) => {
    const { i18n } = useTranslation();

    if (cellData && typeof cellData === 'object' && 'international' in cellData) {
        return <span>{cellData[cellDisplayFormat]}</span>;
    }

    if (cellData && typeof cellData === 'string') {
        return <span>{cellData}</span>;
    }

    return (
        <span>
            {i18n.t('general:noLabel', {
                label: getTranslation(('label' in field ? field.label : null) || '<No Phone Number>', i18n),
            })}
        </span>
    );
};
