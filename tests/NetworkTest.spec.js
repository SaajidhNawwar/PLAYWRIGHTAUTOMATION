const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../Utils/APIUtils');
const loginPayLoad = { userEmail: "saajidhasc@gmail.com", userPassword: "Saaj@123" };
let response;
const fakePayloadOrders = { data: [], message: "No Orders" }

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
    
    // Get the cart to verify product was added
    await page.locator("[routerlink*='cart']").click();
    await page.waitForTimeout(1000);
    
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

    //mock the page to show that there are no orders, faking the response
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", //use star to tell playwright to accept any id
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadOrders);
            route.fulfill(
                {
                    response,
                    body,
                }
            );
            //intercepting the response- API reponse -> {playwright fake response} -> browser -> Render data on frontend
        }
    )

    await page.locator("button[routerlink*='myorders']").click();
    //Tell playwright to wait till we get a reponse 
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());

});