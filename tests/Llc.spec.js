import {test, expect} from '@playwright/test';

//getByLabels are used to capture locators by the text. It is also easy for click operations.

test('Playwright special locators', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Gender").selectOption("Male");
    await page.getByLabel("Employed").check();  //click operation
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name:'Submit'}).click();    //can be used to click buttons
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link", {name:'Shop'}).click();
    //capture the class name of the list, then filter it based on the text,
    // after that click the button that is available in that element
    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button").click();

});