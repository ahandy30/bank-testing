import { test } from "@playwright/test";
import { RegisterPage } from "../page-objects/RegistarPage";
import { faker } from "@faker-js/faker";
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test.beforeEach(async () => {
  const authFile = 'playwright/.auth/user.json';
  if (fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, '{}', 'utf-8');
    console.log('🧹 Cleared authentication file before test.');
  }
});

test("New User Registration", async ({page}) => {
//Registring a new user; there will be up to 3 attempts
const MAX_RETRIES = 3;
let username = faker.internet.username() //using let in case the username is taken; can retry with a different one
const password = faker.internet.password()

const registarPage = new RegisterPage(page);

//Attempt to create create user up to 3 times
for (let i = 0; i<= MAX_RETRIES; i++) {
    await registarPage.navigatetoUserRegistration();
    await registarPage.fillInUserDetailsV2();
    await registarPage.fillInLoginCredentials(username, password);

    // submit the registration form
    await registarPage.clickRegistarButton();
    await page.waitForLoadState('networkidle');

    //if the username exist (user get username exist error) go back to the loop and try again
    if(await registarPage.isUsernameErrorVisible()) {
        continue;
    }

    await registarPage.verifyUserCreation(username);
    await page.context().storageState({ path: authFile });
    break;
}

await page.close();
})

test.skip("Existing User Login", async ({page}) => {
  //TODO
})