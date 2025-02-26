import { Page } from '@playwright/test';

export async function ErrorCatch(fn: () => Promise<void>, errorMessage: string): Promise<void> {
  try {
    await fn();
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error);
    throw error;
  }
}

export async function login(page: Page): Promise<void> {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email address' }).type('ngogiakhanh123@gmail.com', { delay: 10 });
  await page.getByRole('textbox', { name: 'Password' }).type('asd123', { delay: 10 });

  await page.getByRole('button', { name: 'Sign in' }).click(); 
  console.log('✅ Login successfully');
}

export async function logout(page: Page): Promise<void> {
  await page.getByText('Logout').click();
  console.log('✅ Logout successfully');
  await page.close();
}

/**
 * Retrieves data from a specified column in a table.
 * @param page - Playwright page instance
 * @param headerText - The text of the column header to locate
 * @param rowIndex - (Optional) The specific row index to retrieve (0-based index)
 * @returns Either a single row's value (if rowIndex is provided) or all row values in the column
 */
export async function getColumnData(page: Page, headerText: string, rowIndex?: number): Promise<string | string[]> {
  // Locate headers and find the index of the target column
  const headers = await page.locator('th').allTextContents();
  const columnIndex = headers.findIndex(text => text.trim().toLowerCase() === headerText.trim().toLowerCase());


  if (columnIndex === -1) {
    throw new Error(`❌ Column "${headerText}" not found`);
  }

  // Get all values from the column
  const rows = await page.locator(`tbody tr td:nth-child(${columnIndex + 1})`).allTextContents();

  if (rowIndex !== undefined) {
    if (rowIndex < 0 || rowIndex >= rows.length) {
      throw new Error(`❌ Row index "${rowIndex}" is out of range`);
    }
    return rows[rowIndex]; // Return a single row's value
  }

  return rows; // Return all row values
}

/**
 * Checks if a dashboard metric is displayed and extracts its value and percentage change.
 * @param page - Playwright page instance.
 * @param metricName - The metric name (e.g., "Total Users").
 * @returns An object containing the metric value and increase percentage.
 */
export async function checkDashboardMetric(page: Page, metricName: string): Promise<{ value: string; percentage?: string }> {
  // Wait for dashboard section to be visible
  await page.waitForSelector('.p-5', { state: 'visible', timeout: 10000 });

  // Find the correct metric box by matching `dt` text
  const metricBox = page.locator('.p-5').filter({ hasText: metricName });

  // Ensure the box is found
  if (!(await metricBox.isVisible())) {
    throw new Error(`❌ Dashboard metric "${metricName}" not found.`);
  }

  // Get the main metric value (inside `dd > div.text-2xl`)
  const metricValueLocator = metricBox.locator('dd > div.text-2xl');
  const metricValue = await metricValueLocator.textContent();

  // Get the percentage increase (inside the adjacent div with `text-green-600`)
  const percentageLocator = metricBox.locator('dd > div.text-green-600');
  const percentage = await percentageLocator.isVisible() ? await percentageLocator.textContent() : undefined;

  console.log(`✅ Dashboard Metric: "${metricName}" - Value: ${metricValue} ${percentage ? `(⬆ ${percentage})` : ''}`);

  return { value: metricValue?.trim() || '', percentage: percentage?.trim() };
}



/*export async function clickTableCell(page: Page, headerText: string, cellValue: string): Promise<void> {
  // Get all column data
  const columnData = await getColumnData(page, headerText);

  // Find the row index where the cellValue is located
  const rowIndex = columnData.indexOf(cellValue);
  if (rowIndex === -1) {
    throw new Error(`❌ Value "${cellValue}" not found in column "${headerText}"`);
  }

  // Click the correct table cell based on row index
  await page.locator(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnData.indexOf(cellValue) + 1})`).click();
  console.log(`✅ Clicked on cell "${cellValue}" under column "${headerText}"`);
}*/
