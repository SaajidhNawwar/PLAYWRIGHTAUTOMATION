const {test,expect} = require('@playwright/test');

test("Popup Validations", async({page}) =>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    //await page.pause();

    //handling dialog popups
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();

    //handling hover
    await page.locator("#mousehover").hover();

    //handle elements in iFrame
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framePage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
})

test('Screenshot & Visual comparison', async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
})

test.only('Take screenshot and compare it in next test run', async({page}) =>
{
    await page.goto("https://flightaware.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
})