const {test,expect} = require('@playwright/test');
const { text } = require('stream/consumers');

test('Browser Context-Validating test', async ({browser})=>
{
    //chrome - adding plugins/cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //get the page title
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    console.log(await page.title());

    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");

    //login
    await userName.fill('rahulshetty'); 
    await page.locator("[type='password']").fill('learning');   //using css attribute
    await signIn.click();

    //wait until the toast message appears and extract the text
    console.log(await page.locator("[style*='block']").textContent());

    //compare error message text
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    //clear field and enter again
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    //get the names of the 1st and 2nd phone
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());

    //get the list of all the titles
    //first wait till the network call is idle
    await page.waitForLoadState('networkidle');
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);

    //If it doesn't wait for a state to appear, then we can use 'waitFor' method
    
    /*await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);*/

});

test('Page Playwright test', async ({page})=>
{
    //not adding any plugins or cookies. Just directly open up the page
    await page.goto("https://google.com");

});

//selecting dropdowns and radio buttons
test('UI Controls', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");   //capture the class [input-type.class]
    await dropdown.selectOption("consult"); //capture the 'value' of the needed field
    await page.locator(".radiotextsty").last().click(); //use the class name to capture the locator
    await page.locator("#okayBtn").click();

    console.log(await page.locator(".radiotextsty").last().isChecked());    //check if its selected
    await expect(page.locator(".radiotextsty").last()).toBeChecked();   //waiting till it gets checked

    //checkbox
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy(); //to check that the checkbox is unticked and return true

    //check if blinking text is visible
    await expect(documentLink).toHaveAttribute("class","blinkingText"); //enter class name, text

})

test('Opening a child window', async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),   //listen for any new page pending, rejected, fulfilled
        documentLink.click()
    ])// new page opened

    const text = await newPage.locator(".im-para.red").textContent();
    console.log(text);

    //pull out the 'email id' in the child page and enter it to the parent page username

    const arrayText = text.split("@")  //split the text into two taking "@" the middle
    console.log(arrayText[1]);
    const domain = arrayText[1].split(" ")[0]   // 1.Take the 2nd split of above text 2.Split the text after the " "
    console.log(domain);
    await page.locator("#username").fill(domain);
    //await page.pause();
    console.log("------");
    console.log(await page.locator("#username").textContent());

})