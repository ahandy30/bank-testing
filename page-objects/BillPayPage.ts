import { Locator, Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

export class BillPayPage {
    private page: Page;
    readonly billPayLink: Locator;
    readonly billPayeeName: Locator
    readonly billPayeeAddress: Locator
    readonly billPayeeCity: Locator;
    readonly billPayeeState: Locator;
    readonly billPayeeZipCode: Locator;
    readonly billPayeePhoneNumber: Locator;
    readonly billPayAccount: Locator;
    readonly billPayConfirmAccount: Locator;
    readonly billAmount: Locator;
    readonly billPaySourceAccount: Locator;
    readonly sendPaymentButton: Locator;
    readonly billPaymentSuccessHeader: Locator;
    readonly billPaymentSuccessMessage: Locator;

    constructor (page: Page) {
        this.page = page;
        this.billPayLink = page.locator('#leftPanel').getByRole('link', { name: 'Bill Pay' });
        this.billPayeeName = page.locator('input[name="payee.name"]');
        this.billPayeeAddress = page.locator('input[name="payee.address.street"]');
        this.billPayeeCity = page.locator('input[name="payee.address.city"]');
        this.billPayeeState = page.locator('input[name="payee.address.state"]');
        this.billPayeeZipCode = page.locator('input[name="payee.address.zipCode"]');
        this.billPayeePhoneNumber = page.locator('input[name="payee.phoneNumber"]');
        this.billPayAccount = page.locator('input[name="payee.accountNumber"]');
        this.billPayConfirmAccount = page.locator('input[name="verifyAccount"]');
        this.billAmount = page.locator('input[name="amount"]');
        this.billPaySourceAccount = page.getByRole('combobox');
        this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
        this.billPaymentSuccessHeader = page.getByRole('heading', { name: 'Bill Payment Complete' });
        this.billPaymentSuccessMessage = page.getByText(/Bill Payment to/);
    }

    async goToPayBill() {
        await this.billPayLink.click()
    }


    async fillInBillPayeeDetails(payeeName: string, billAcct: string, amt: string) {
        await this.billPayeeName.fill(payeeName);
        await this.billPayeeAddress.fill(faker.location.streetAddress());
        await this.billPayeeCity.fill(faker.location.city());
        await this.billPayeeState.fill(faker.location.state());
        await this.billPayeeZipCode.fill(faker.location.zipCode());
        await this.billPayeePhoneNumber.fill(faker.phone.number());
        await this.billPayAccount.fill(billAcct)
        await this.billPayConfirmAccount.fill(billAcct)
        await this.billAmount.fill(amt);
        await this.billPaySourceAccount.selectOption({index: 0});
    }

    async sendPayment() {
        await this.sendPaymentButton.click();
    }

    async getSourceAccountId() {
        await this.billPaySourceAccount.waitFor();
        return await this.billPaySourceAccount.selectOption({index: 0});
    }

    async verifyBillPaymentSucess(billPayee: string, amt: string, sourceAcct: string) {
        await expect(this.billPaymentSuccessHeader).toBeVisible();
        await expect(this.billPaymentSuccessHeader).toContainText("Bill Payment Complete");
        await expect(this.billPaymentSuccessMessage).toBeVisible();
        await expect(this.billPaymentSuccessMessage).toContainText(`Bill Payment to ${billPayee} in the amount of $${amt} from account ${sourceAcct} was successful.`);

    }


}