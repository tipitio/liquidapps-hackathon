<h1>Demo Instructions</h1>

There are 2 versions of the same demo, one is built on php, and the other is built on node.  This is to illustrate the idea that the finance services interacting with the Stripe/Other API and endpoints can be made easier for developers by providing more than one language.


<b>Online Demo (uses PHP)</b>

To try the uploaded, online version of the demo, first, launch Scatter and if you already have the "tipit" app, remove it. Next, you'll need to create and identity on the Kylin test network and also add it to Scatter, those instructions can be found here - https://medium.com/the-liquidapps-blog/liquidapps-walkthrough-2-staking-to-dapp-service-providers-and-deploying-a-vram-dapp-667007b3b8df .  Once you have the network added, import your private key into Scatter, and head to  https://tipit.io/liquidapps-hackathon/ to go through the demo.


<b>NodeJS Demo</b>

1. First, clone the repo. Enter the nodejs/services folder in your terminal and run "touch .env", or create a .env file another way.

2. If you don't have a developer account for Stripe, you'll need to sign up, create a customer, copy the customer ID, and also copy the Stripe secret API key for autorization.

3. Open your .env file and add the following

    STRIPE_KEY=your Stripe API Key<br>
    STRIPE_CUSTOMER=your Stripe customer ID<br>
    TIPIT_ENDPOINT=http://tipit.io/<br>

4. Go to the nodejs/services directory and run "yarn" to get the project dependencies.

5. Once the dependencies are installed, run "node index" from the service directory to start the server.  You'll want to make sure you don't have a firewall blocking it, you should read that the server started on port 5000.

6. Navigate to the index.html file in a browser, or place it in a server directory if you have an existing webserver.

7. You are now ready to go. The tipit checkout method is disabled for the demo as the endpoint is private but you will now be able to check out with a the Scatter method.


<b>PHP Demo</b>

1. First, clone the repo. Enter the php folder and use composer to install the Stripe library, found here - https://github.com/stripe/stripe-php

2. If you don't have a developer account for Stripe, you'll need to sign up, create a customer, copy the customer ID, and also copy the Stripe secret API key for autorization.

3. Once the Stripe library is installed, you'll need to edit the "settings.php" file in the directory and enter in the customer you created as the $settings['customer-id'] variable, and the Stripe key for the $settings['stripe-key'] variable.

4. You are now ready to go. The tipit checkout method is disabled for the demo as the endpoint is private but you will now be able to check out with a the Scatter method.
