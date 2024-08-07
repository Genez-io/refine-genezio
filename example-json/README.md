# Description

This exemplifies a web admin interface that uses refine as a front-end and Genezio in the backend. It exposes some genezio classes as well as Genezio-based authentication. It uses a plain json file for data storage.

You can play with it here: https://beige-mild-gull.app.genez.io/

# Deploying this example 

[![Deploy to Genezio](https://raw.githubusercontent.com/Genez-io/graphics/main/svg/deploy-button.svg)](https://app.genez.io/start/deploy?repository=https://github.com/Genez-io/refine-genezio&base_path=example-json)

Or follow these steps to deploy this example using genezio's cli

1. Clone this repository locally
2. `cd example-json`
3. Install genezio with `npm install -g genezio`
4. Deploy the project with `genezio deploy`
5. Go to the Genezio App in your broser by accessing https://app.genez.io/ and choose your project
6. Enable Authentication by choosing "Authentication" on the left-side menu (this will create a database for user management), and enable the Email provider
7. Make sure you update the reset password URL from Authentication / Settings / Email Templates / Reset Password to `https://ABC-DEF-GHI.app.genez.io/reset-password` (you'll find your domain name under the Domains section)
8. Update the auth token / region in the `client/src/authProvider.ts` file with the ones provided by Genezio - you can find them in the above Authentication section
9. Redeploy the genezio project by running `genezio deploy` again
10. Go to `https://ABC-DEF-GHI.app.genez.io/` again and test the project in your browser

# Using refine on a new genezio project

1. Install Genezio using `npm install -g genezio`
2. Create a Genezio project using `genezio create` (FullStack, using React / TypeScrypt) 
3. Create a (or copy an existing) refine project in the client folder, and update the `vite.config.ts` file to include `@genezio/vite-plugin-genezio` (see an example in the client/ folder of this repo)
4. Run `npm install refine-genezio` in your client folder
5. Update the client/App.tsx file as follows:
```
...
import dataProvider from "refine-genezio";
import * as gsdk from "@genezio-sdk/YOUR_PROJECT_NAME";
...
<Refine dataProvider={dataProvider(gsdk)} ... >
...
```
6. Run `genezio local` in your project folder
7. Add some resources as classes in Genezio and use them in your Refine App (see this repo again for inspiration). The resource names in your refine client should match the classes name on Genezio
8. if you want to deploy your project, run `genezio deploy`

If your app uses authentication:

1. Run `npm i @genezio/auth` in your client folder
2. Copy the client/src/auth/ contents to your project and add the auth routes as exemplified in the App.tsx file in this repo
3. Copy the [authProvider.ts](https://github.com/bogdanripa/refine-genezio/blob/main/example-json/client/src/authProvider.ts) file to your Refine project
4. Run `genezio deploy` in the project root folder
5. Go to the Genezio App in your broser by accessing https://app.genez.io/ and choose your project
6. Enable Authentication by choosing "Authentication" on the left-side menu, and enable the Email provider
7. Make sure you update the reset password URL from Authentication / Settings / Email Templates / Reset Password to `https://ABC-DEF-GHI.app.genez.io/reset-password` (you'll find your domain name under the Domains section)
8. Update the auth **token** / **region** in the `client/src/authProvider.ts` file with the ones provided by Genezio - you can find them in the above Authentication section
9. Redeploy the genezio project by running `genezio deploy` again
10. Go to `https://ABC-DEF-GHI.app.genez.io/` again and test the project in your browser

