const {expect} = require('@playwright/test');

class CartPage
{
    constructor(page)
    {
        this.page = page;
        this.checkOutBtn = page.locator("text=Checkout");
        this.cartProducts = page.locator("div li").first();
    }

    async verifyProductIsDisplayed(productName)
    {
        await this.page.waitForTimeout(2000);
        //await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy();
    }

    getProductLocator(productName)
    {
        return this.page.locator("h3:has-text('"+productName+"')");
    }

    async Checkout()
    {
        await this.checkOutBtn.click();
    }
}
module.exports = {CartPage};