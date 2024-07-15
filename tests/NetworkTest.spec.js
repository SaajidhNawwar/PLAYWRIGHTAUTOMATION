const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../Utils/APIUtils');
const loginPayLoad = { userEmail: "saajidhasc@gmail.com", userPassword: "Saaj@123" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6581ca979fd99c85e8ee7faf" }] };
let response;
const fakePayloadOrders = { data: [], message: "No Orders" }

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    // response =  await apiUtils.getToken(loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
test('@API Place the order', async ({ page }) => {
    //Bypass UI login with API
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

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