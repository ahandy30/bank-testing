import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { AccountServicesPage } from '../page-objects/AccountServicesPage';
import { TransferFundsPage } from '../page-objects/TransferFundsPage';
import { BillPayPage } from '../page-objects/BillPayPage';


let newAccountId: string | null | undefined;
let fromAccountId;

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  
})

test('Opens a new banking account', async ({ page }) => {
  const accountPage = new AccountServicesPage(page);
  await accountPage.goToOpenAccount();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');
  await accountPage.createAccount();
  newAccountId = await accountPage.getNewAccountId();
  await accountPage.verifyAccountCreation(newAccountId as string);
  await page.close();
});

test('Transfer funds between banking accounts', async ({ page }) => {
  test.skip(newAccountId === null || newAccountId === undefined, 'Skipping test because newAccountId is not set');
  const transferPage = new TransferFundsPage(page);
  await transferPage.gotoTransferFunds();
  let transferAmout = '200';
  fromAccountId = await transferPage.getSourceAccountId();
  
  // Narrow the type: assert it's not null before using it
  expect(fromAccountId).not.toBeNull();
  
  expect(typeof newAccountId).toBe('string');
  await transferPage.fillTransferDetails(transferAmout, newAccountId as string);
  await page.waitForLoadState('networkidle');
  await transferPage.submitFundsTransfer();
  await transferPage.verifyFundsTransferSuccess(transferAmout, fromAccountId as string, newAccountId as string);
  await page.close();
})

test('Pay a Bill', async ({ page }) => {
  const billPay = new BillPayPage(page)
  await billPay.goToPayBill();
  const billPayeeName = faker.person.fullName()
  let fromAccountId2
  let billAccount = faker.string.numeric(6)
  let billAmount = '50.00'
  fromAccountId2 = await billPay.getSourceAccountId();

  // Narrow the type: assert it's not null before using it
   expect(fromAccountId2).not.toBeNull();

  await billPay.fillInBillPayeeDetails(billPayeeName, billAccount, billAmount);
  await page.waitForLoadState('networkidle')
  await billPay.sendPayment();
  //console.log(` This is the payee name ${billPayeeName}`)
  //console.log(fromAccountId2)
  await billPay.verifyBillPaymentSucess(billPayeeName as string, billAmount, fromAccountId2[0])
  
  await page.close();
})

//# sourceMappingURL=tests.js.map