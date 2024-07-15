const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  retries : 1,     //retries for failed test cases
  workers: 2,    //at a time,only 1 worker should run

  //Maximum time one test can run for
  timeout: 30*1000,
  expect:{
    timeout:5000
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  projects : [
    {
      name : 'Safari',
      use: {

        browserName : 'webkit',
        headless : false,
        screenshot : 'off',
        trace: 'on',
        ...devices['iPhone 11 Pro'],  
    
      }
    },
    {
      name : 'Chrome',
      use: {

        browserName : 'chromium',
        headless : false,
        screenshot : 'on',
        video : 'retain-on-failure',
        trace: 'on',
        ignoreHTTPSErrors : true,   //will ignore SSL certification errors
        permissions : ['geolocation'],  //browser will allow locations popup
        //viewport : {width:720,height:720}   //set the browser size
    
      }
    }

  ]
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  
});

