import { Page, Locator, expect } from '@playwright/test';

export class TransferFundsPage {
    private page: Page;
    readonly transferFundsLink: Locator;
    readonly amount: Locator;
    readonly sourceAccount: Locator;
    readonly destinationAccount: Locator;
    readonly transferFundsButton: Locator;
    readonly transferHeader: Locator;
    readonly transferDetailsText: Locator;

    constructor(page: Page) {
        this.page = page
        this.transferFundsLink = page.locator('#leftPanel').getByRole('link', { name: 'Transfer Funds' });
        this.amount = page.locator('#amount');
        this.sourceAccount = page.locator('#fromAccountId');
        this.destinationAccount = page.locator('#toAccountId');
        this.transferFundsButton =  page.getByRole('button', { name: 'Transfer' });
        this.transferHeader = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.transferDetailsText = page.getByText(/has been transferred from account/);
    }

    async gotoTransferFunds() {
        await this.transferFundsLink.click();
    }

     async fillTransferDetails(fundAmount: string, toAcct: string) {
        await this.amount.fill(fundAmount);
        await this.sourceAccount.selectOption({ index: 0 });
        await this.destinationAccount.selectOption(toAcct);
    }

    async submitFundsTransfer() {
        await this.transferFundsButton.click({ timeout: 5000 });
    }

    async getSourceAccountId() {
        await this.sourceAccount.waitFor();
        return await this.destinationAccount.locator('option:checked').textContent();
    }

    async verifyFundsTransferSuccess(amount: string, fromAcct: string, toAcct: string) {
        await expect(this.transferHeader).toBeVisible();
        await expect(this.transferHeader).toContainText("Transfer Complete!");
        await expect(this.transferDetailsText).toBeVisible();
        await expect(this.transferDetailsText).toContainText(`$${amount}.00 has been transferred from account #${fromAcct} to account #${toAcct}.`);
    }
}