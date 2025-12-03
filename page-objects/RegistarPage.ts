import { Page, Locator, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';

export class RegisterPage {
    private page: Page;
    readonly firstName: Locator
    readonly lastName: Locator;
    readonly address: Locator
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly phoneNumber: Locator;
    readonly ssn: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPassword: Locator;
    readonly registarButton: Locator;
    readonly usernameAlreadyExistsError: Locator;

    constructor(page:Page) {
        this.page = page;
        this.firstName = page.locator('[id="customer.firstName"]');
        this.lastName = page.locator('[id="customer.lastName"]');
        this.address = page.locator('[id="customer.address.street"]');
        this.city = page.locator('[id="customer.address.city"]');
        this.state = page.locator('[id="customer.address.state"]');
        this.zipCode = page.locator('[id="customer.address.zipCode"]');
        this.phoneNumber = page.locator('[id="customer.phoneNumber"]');
        this.ssn = page.locator('[id="customer.ssn"]');
        this.usernameInput =  page.locator('[id="customer.username"]');
        this.passwordInput = page.locator('[id="customer.password"]');
        // confirm password field on the registration page is `repeatedPassword`
        this.confirmPassword = page.locator('#repeatedPassword');
        this.registarButton = page.getByRole('button', { name: 'Register' });
        this.usernameAlreadyExistsError = page.locator('[id="customer.username.errors"]');
    }

    async navigatetoUserRegistration() {
        await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    }

    //Version 1 using included arguements
    async fillInUserDetailsV1(firstName:string, lastName: string, street: string, 
        city: string, state: string, zipcode: string, phoneNumber: string, ssn: string,
        username: string, password: string, confirmPassword: string ): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.address.fill(street);
        await this.city.fill(city);
        await this.state.fill(state);
        await this.zipCode.fill(zipcode);
        await this.phoneNumber.fill(phoneNumber);
        await this.ssn.fill(ssn);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPassword.fill(confirmPassword);
        await this.registarButton.click();

    }

    //Version 2 using faker details
    async fillInUserDetailsV2() {
        await this.firstName.fill(faker.person.firstName());
        await this.lastName.fill(faker.person.lastName());
        await this.address.fill(faker.location.streetAddress());
        await this.city.fill(faker.location.city());
        await this.state.fill(faker.location.state());
        await this.zipCode.fill(faker.location.zipCode());
        await this.phoneNumber.fill(faker.phone.number());
        await this.ssn.fill(faker.string.numeric(9));
    }

    //login credentials are seperate in case there are duplicates
    async fillInLoginCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPassword.fill(password);
    }

    async clickRegistarButton(){
        await this.registarButton.click();
    }

    //Verifying if newly created user sees the correct welcome header and text
    async verifyUserCreation(username: string) {
        const headerLocator = this.page.locator('h1');
        const rightPanel = this.page.locator('#rightPanel');

        // use Playwright's locator assertions which include automatic waiting
        await expect(headerLocator).toContainText(`Welcome ${username}`);
        await expect(rightPanel).toContainText('Your account was created successfully. You are now logged in.');
    }
    
    //Does the user see the username already exist error
    async isUsernameErrorVisible () {
        return this.usernameAlreadyExistsError.isVisible()
    }
}