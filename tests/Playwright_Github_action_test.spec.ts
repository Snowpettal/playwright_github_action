import { test, expect } from '@playwright/test';
import { ErrorCatch, login, logout, getColumnData, checkDashboardMetric } from './utils';

test.describe('UI Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await ErrorCatch(() => login(page), 'Login Failed');
  });

  test.afterAll(async () => {
    await ErrorCatch(async () => {
      await logout(page);
      await page.close();
    }, 'Logout Failed');
  });

  test('Check Dashboard UI', async () => {
    await ErrorCatch(async () => {
      await page.getByText('Dashboard').click();
      await page.waitForTimeout(4000);
      
      const metrics = ['Total Users', 'Active Deal'];
      for (const metric of metrics) {
        const result = await checkDashboardMetric(page, metric);
        if (result.percentage) {
          console.log(`📈 ${metric}: ${result.percentage}`);
        }
      }
    }, 'Dashboard Metrics Test Failed');
  });

  test('Check User Management UI', async () => {
    await ErrorCatch(async () => {
      await page.getByText('Users', { exact: true }).click();
      await page.waitForTimeout(6000);
      
      const pageNumber = '2';
      const paginationButton = page.locator(`a:text("${pageNumber}")`);
      if (await paginationButton.count() > 0) {
        await paginationButton.click();
        console.log(`✅ Navigated to page ${pageNumber}`);
      }
      
      await page.waitForSelector('th', { state: 'visible' });
      await page.waitForTimeout(3000);
      await page.waitForSelector('tbody tr', { state: 'visible' });
      
      const rowCount = await page.locator('tbody tr').count();
      console.log(`🔍 Total Rows: ${rowCount}`);
      if (rowCount === 0) return;
      
      const columns = ['Telegram ID', 'Username', 'User Info', 'Country', 'Registered Date', 'Last Login', 'TCA$H Balance', 'Has Pending Cashback', 'Confirmed Cashback', 'Withdrawable Balance'];
      for (const column of columns) {
        const data = await getColumnData(page, column);
        console.log(`📌 ${column}: ${data[1] || 'N/A'}`);
      }
    }, 'User Management UI Test Failed');
  });

  test('Check Categories UI', async () => {
    await ErrorCatch(async () => {
      await page.getByText('Categories').click();
      await page.waitForTimeout(4000);
      
      await page.waitForSelector('th', { state: 'visible' });
      
      const columns = ['ID', 'Name', 'Status'];
      for (const column of columns) {
        const data = await getColumnData(page, column);
        console.log(`📌 ${column}: ${data[1] || 'N/A'}`);
      }
    }, 'Categories UI Test Failed');
  });

  test('Check Deals Management UI', async () => {
    await ErrorCatch(async () => {
      await page.getByText('Deals', { exact: true }).click();
      await page.waitForTimeout(6000);
      
      // Wait for table headers and at least one row to appear
      await page.waitForSelector('th', { state: 'visible' });
      await page.waitForTimeout(3000);
      await page.waitForSelector('tbody tr', { state: 'visible' });
  
      // Get total row count
      const rowCount = await page.locator('tbody tr').count();
      console.log(`🔍 Total Rows in Table: ${rowCount}`);
  
      if (rowCount === 0) {
        console.warn("⚠️ No deals found in the table.");
        return;
      }
  
      // Function to get a random row index
      const getRandomRow = () => Math.floor(Math.random() * rowCount);
  
      // Validate Icon visibility before extracting data
      const randomRowIndex = getRandomRow();
      const iconLocator = page.locator(`tbody tr:nth-child(${randomRowIndex + 1}) td:nth-child(1) img`);
      await expect(iconLocator).toBeVisible();
      console.log(`✅ Icon is visible in Row ${randomRowIndex + 1}`);
  
      // Get and log random column data
      const columnsToCheck = ['Name', 'Card Name', 'Provider', 'Region', 'Categories', '%', 'Reward', 'Priority', 'Hot', 'Featured', 'Status'];
      
      for (const column of columnsToCheck) {
        const randomRow = getRandomRow();
        const randomData = await getColumnData(page, column, randomRow);
        console.log(`📌 Random ${column} (Row ${randomRow + 1}): ${randomData}`);
      }
  
    }, 'Deals Management UI test Failed');
  });
  

  test('Check Audit Log UI', async () => {
    await ErrorCatch(async () => {
      await page.getByText('Audit Logs').click();
      await page.waitForSelector('th', { state: 'visible' });
      
      const columns = ['Timestamp', 'Admin', 'USER ID', 'Changes'];
      for (const column of columns) {
        const data = await getColumnData(page, column);
        console.log(`📌 ${column}: ${data[1] || 'N/A'}`);
      }
    }, 'Audit Log Test Failed');
  });
});
