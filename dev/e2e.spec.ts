import { expect, test, Page } from '@playwright/test';

test.describe.serial('Phone Number Field E2E', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();

        await page.goto('/admin/login');
        await page.waitForSelector('input[name="email"]');
        await page.fill('input[name="email"]', 'dev@payloadcms.com');
        await page.fill('input[name="password"]', 'test');
        await page.click('button[type="submit"]');

        await page.waitForURL('/admin', { timeout: 10000 });
        await expect(page).toHaveTitle(/Dashboard/);
    });

    test('prevents creating employee without required phone number', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/admin\/collections\/employees\/create/);

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Test Employee');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/\/admin\/collections\/employees\/create/);
    });

    test('allows creating employee with valid phone number', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Valid Employee');
        await page.fill('#field-phoneNumber', '+4745360001');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForURL(/\/admin\/collections\/employees\/.+/, { timeout: 5000 });
    });

    test('shows validation error for invalid phone number', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Test Employee');
        await page.fill('#field-phoneNumber', 'not-a-phone-number');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/\/admin\/collections\/employees\/create/);
    });

    test('allows pasting phone number from different country and formats it correctly', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Paste Test Employee');

        const phoneInput = page.locator('#field-phoneNumberAnyCountry');
        await expect(phoneInput).toBeVisible();

        const phoneFieldContainer = phoneInput.locator('..');
        const countryButton = phoneFieldContainer.locator('.phone-number__select-region-code-button');
        await countryButton.click();

        await page.waitForTimeout(500);
        const usRegionOption = page.locator('.rs__option', { hasText: 'United States' });
        await usRegionOption.click();
        await page.waitForTimeout(300);

        await phoneInput.fill('6505553434');
        await page.waitForTimeout(500);

        const inputValue = await phoneInput.inputValue();
        expect(inputValue).toContain('650');

        await phoneInput.click();
        await phoneInput.selectText();

        await phoneInput.fill('');
        await page.evaluate(async () => {
            const input = document.querySelector('#field-phoneNumberAnyCountry') as HTMLInputElement;
            if (input) {
                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                });
                pasteEvent.clipboardData?.setData('text/plain', '+4745360001');
                input.dispatchEvent(pasteEvent);
            }
        });

        await page.waitForTimeout(1000);

        const finalValue = await phoneInput.inputValue();
        expect(finalValue).toBe('45 36 00 01');

        const callingCodeElement = phoneFieldContainer.locator('.phone-number__calling-code');
        const callingCode = await callingCodeElement.textContent();
        expect(callingCode).toBe('+47');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForURL(/\/admin\/collections\/employees\/.+/, { timeout: 5000 });
    });

    test('prevents pasting phone number from disallowed country', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Invalid Paste Employee');

        const phoneInput = page.locator('#field-phoneNumber');
        await expect(phoneInput).toBeVisible();

        await phoneInput.click();
        await page.evaluate(async () => {
            const input = document.querySelector('#field-phoneNumber') as HTMLInputElement;
            if (input) {
                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                });
                pasteEvent.clipboardData?.setData('text/plain', '+16505553434');
                input.dispatchEvent(pasteEvent);
            }
        });

        await page.waitForTimeout(1000);

        const finalValue = await phoneInput.inputValue();
        expect(finalValue).toBe('(650) 555-3434');

        const phoneFieldContainer = phoneInput.locator('..');
        const callingCodeElement = phoneFieldContainer.locator('.phone-number__calling-code');
        const callingCode = await callingCodeElement.textContent();
        expect(callingCode).toBe('+1');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/\/admin\/collections\/employees\/create/);
    });

    test('displays phone number in correct display format in admin table cells', async () => {
        await page.goto('/admin/collections/employees/create');
        await page.waitForLoadState('networkidle');

        await page.waitForSelector('#field-name', { timeout: 10000 });
        await page.fill('#field-name', 'Cell Display Test');
        await page.fill('#field-phoneNumber', '+4745360001');
        await page.fill('#field-phoneNumberNotRequired', '+4745360001');

        const saveButton = page.locator('#action-save');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        await page.waitForURL(/\/admin\/collections\/employees\/.+/, { timeout: 5000 });

        await page.goto('/admin/collections/employees');
        await page.waitForLoadState('networkidle');

        const firstRow = page.locator('tr.row-1');

        const internationalCell = firstRow.locator('td.cell-phoneNumber span');
        await expect(internationalCell).toBeVisible({ timeout: 10000 });

        const internationalText = await internationalCell.textContent();
        expect(internationalText).toBe('+47 45 36 00 01');
    });
});
