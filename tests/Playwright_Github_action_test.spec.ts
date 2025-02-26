import { test, expect } from '@playwright/test'; 

test('Github', async({ page }) => {

   await page.goto('https://github.com/');

await expect(page).toHaveTitle('GitHub: Let’s build from here · GitHub');

   await page.getByRole('link', { name:'Sign in' }).click();

   await page.locator('#login_field').fill('giakhanhngo210802@gmail.com');

   await page.fill('#password', '21082002Ngk*');

   await page.click('input[value=’Sign in’]');

   await page.click('span.Button-label > img.avatar');

   await page.waitForTimeout(2000);

   await page.getByText('Your profile').click();

   await page.getByText('Edit profile').click();

   await page.waitForTimeout(2000);

   await page.fill('#user_profile_name', 'YOUR_PROFILE_NAME');

   await page.click('span.Button-label:has-text("Save")');

   await page.waitForTimeout(2000);

});