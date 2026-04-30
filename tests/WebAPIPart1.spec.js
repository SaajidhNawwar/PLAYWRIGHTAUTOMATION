const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../Utils/APIUtils');
const loginPayLoad = { userEmail: "saajidhasc@gmail.com", userPassword: "Saaj@123" };
let response;


test.beforeAll(async ({ browser }) => {
    // Use UI to login and add product (which ensures valid product ID)
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("saajidhasc@gmail.com");
    await page.locator("#userPassword").fill("Saaj@123");
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');
    
    // Add valid product to cart via UI
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator(".card-body");
    const count = await products.count();
    
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() == productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    
    await page.waitForTimeout(1000);
    
    // Go to cart and checkout to create a real order
    await page.locator("[routerlink*='cart']").click();
    await page.waitForTimeout(1000);
    
    await page.locator("text=Checkout").click();
    await page.locator(".input.ddl").first().selectOption('10');
    await page.locator(".input.ddl").nth(1).selectOption('25');
    await page.locator("[placeholder='Select Country']").pressSequentially("ind");
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    await dropdown.locator("button").first().click();
    await page.locator(".btn-lg").click();
    await page.waitForTimeout(2000);
    
    // Get the order ID from the confirmation page
    response = { orderId: await page.locator(".em-spacer-1 .ng-star-inserted").last().textContent() };
    
    // Store context for later tests
    await context.storageState({ path: 'state.json' });
    await context.close();
})


//create order is success
test('@API Place the order', async ({ browser }) => {
    // Use the stored context from beforeAll
    const context = await browser.newContext({ storageState: 'state.json' });
    const page = await context.newPage();
    
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    //After viewing the order summary, again verify if order id displayed there is the same
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});