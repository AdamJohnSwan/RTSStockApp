import { test, expect } from '@playwright/test';

function generateRandomEmail() {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + '@example.com';
};

test('stock check', async ({ page }) => {

    // Register
    const email = generateRandomEmail();
    const password = "Password1!";
    await page.goto('/register');

    await page.fill('input#email', email);
    await page.fill('input#password', password);

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/login?created=true');
    await expect(page.getByText('Registration successful.')).toBeVisible();

    // Login
    await page.fill('input#email', email);
    await page.fill('input#password', password);

    await page.click('button[type="submit"]');

    // Should be a the home page now
    await expect(page).toHaveURL('/');


    // Fill in the stock symbol input with Apple symbol
    await page.fill('input', 'AAPL');

    // Submit the form to check the stock price
    await page.click('button[type="submit"]');

    // Expect the stock price to be displayed on the page
    await expect(page.getByText('Current price:')).toBeVisible();
});

test('redirect un-authed user', async ({ page }) => {

    // Try to go to home page
    await page.goto('/');

    // User is not logged in so they should go to the login page
    await expect(page).toHaveURL('/login');
});