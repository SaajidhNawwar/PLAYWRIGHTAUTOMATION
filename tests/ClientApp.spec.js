const { test, expect} = require('@playwright/test');
const { text } = require('stream/consumers');

test('Client App Login', async ({page}) => {
    const email = "anshika@gmail.com";
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    //Wait till the productName is matched. After that click add to cart
    const count = await products.count();
    for(let i=0;i<count;++i)
    {
        if(await products.nth(i).locator("b").textContent() == productName)
            {
                //add product to cart
                await products.nth(i).locator("text= Add To Cart").click();
                break;
            }
    }
    await page.locator("[routerlink*='cart']").click();
    
    //assertion to check if added item is available in Add To Cart page
    await page.locator("div li").first().waitFor(); //waiting for the 1st one in the list to load
    const bool = page.locator("h3:has-text('ADIDAS ORIGINAL')").isEnabled();
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    //Enter payment details
    await page.locator(".input.ddl").first().selectOption('10');
    await page.locator(".input.ddl").nth(1).selectOption('25');

    //

    //Enter checkout details related to email and country
    await page.locator("[placeholder='Select Country']").pressSequentially("ind");
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();    //looking for buttons in 'ta-results' class
    for(let i=0; i<optionsCount;++i)
    {
        const textBtn = await dropdown.locator("button").nth(i).textContent();
        if(textBtn === " India")
        {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    //


    //Assertion to verify order is successfully placed
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    //Go to orders page and check for the exact orderId and then click to view its details
    await page.locator("button[routerlink*='orders']").click();
    await page.locator(".table-bordered").waitFor();
    const rows = await page.locator("tbody tr");

    for(let i=0; i<await rows.count(); ++i){
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if(orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    //After viewing the order summary, again verify if order id displayed there is the same
    const orderIdDetails = await page.locator(".-main").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

    
    

})