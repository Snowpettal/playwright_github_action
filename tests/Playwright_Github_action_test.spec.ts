import { test, expect } from '@playwright/test'; 

test('Github', async({ page }) => {

   await page.goto('https://github.com/');


   await page.getByRole('link', { name:'Sign in' }).click();

   await page.locator('#login_field').fill('giakhanhngo210802@gmail.com');

   await page.fill('#password', '21082002Ngk*');

   await page.getByRole('button', { name: 'Sign in', exact: true }).click();

   await page.waitForTimeout(3000);

    await page.getByRole('button', { name: 'Open user navigation menu' }).click();

    await page.waitForTimeout(2000);

   await page.getByRole('link', { name: 'Your profile' }).click();

   await page.getByText('Edit profile').click();

   await page.waitForTimeout(2000);

   await page.fill('#user_profile_name', 'Snowpettal');

   await page.click('span.Button-label:has-text("Save")');

   await page.waitForTimeout(2000);
   await page.close();

});