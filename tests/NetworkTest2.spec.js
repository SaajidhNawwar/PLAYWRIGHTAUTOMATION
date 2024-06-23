const { test, expect } = require('@playwright/test');

test('Try to access an unauthorized page', async ({ page }) => {
    //1. Login and reach the 'Orders' page
    const email = "saajidhasc@gmail.com";
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Saaj@123");
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.locator("button[routerlink*='orders']").click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=66741b83ae2afd123405f454" }));  //enter fake orderid
    await page.locator("button:has-text('View')").first().click();  //upon clicking, 403 error should be displayed
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})