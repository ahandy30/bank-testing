import { test, expect } from '@playwright/test';
import { AccountServicesPage } from '../page-objects/AccountServicesPage';
import { TransferFundsPage } from '../page-objects/TransferFundsPage';

let newAccountId: string | null | undefined;
let fromAccountId;

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});

test('Opens a new banking account', async ({ page }) => {
  const accountPage = new AccountServicesPage(page);
  await accountPage.goTo();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');
  await accountPage.submitAccountForm();
  newAccountId = await accountPage.getNewAccountId();
  await accountPage.verifyAccountCreation(newAccountId as string);
  await page.close();
});

test('Transfer funds between own banking accounts', async ({ page }) => {
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