import type { ClientField } from 'payload';

import type { CSSProperties } from 'react';

// Note: this was copied from Payload as it's not exported
export const mergeFieldStyles = (field: ClientField | Omit<ClientField, 'type'>): CSSProperties => ({
    ...(field?.admin?.style || {}),
    ...(field?.admin?.width
        ? {
              '--field-width': field.admin.width,
          }
        : {
              flex: '1 1 auto',
          }),
    ...(field?.admin?.style?.flex
        ? {
              flex: field.admin.style.flex,
          }
        : {}),
});
