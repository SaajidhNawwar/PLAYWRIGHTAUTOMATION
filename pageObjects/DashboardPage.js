class DashboardPage
{
    constructor(page)
    {
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
    }

    async searchProductAddCart(productName)
    {
        const titles = await this.productsText.allTextContents();
        console.log(titles);

        //Wait till the productName is matched. After that click add to cart
        const count = await this.products.count();
        for(let i=0;i<count;++i)
        {
            if(await this.products.nth(i).locator("b").textContent() == productName)
            {
                //add product to cart
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart()
    {
        await this.cart.click();
    }

    async navigateToOrders()
    {
        await this.orders.click();
    }
}

module.exports = {DashboardPage};