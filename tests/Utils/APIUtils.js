class APiUtils
{
 
    constructor(apiContext,loginPayLoad)
    {
        this.apiContext =apiContext; 
        this.loginPayLoad = loginPayLoad;
        
    }
 
    async getToken()
    {
        
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad
        } )//200,201,

        const loginResponseJson = await loginResponse.json();   //store the json object
        const token =loginResponseJson.token;   //capture the token from the json object
        console.log(token);
        return token;
 
    }
 
    //Get the latest orderId through API by skipping all UI automation related to add to cart, and checkout
    //Requirement - Make sure created order is coming in order history page
    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data : orderPayLoad,
            headers:{
                'Authorization' :response.token,
                'Content-Type'  : 'application/json'
            },
 
        })
    const orderResponseJson =await orderResponse.json();
    console.log(orderResponseJson);
    const orderId = orderResponseJson.orders[0];
    response.orderId = orderId;
 
    return response;
    }
 
}
module.exports = {APiUtils};