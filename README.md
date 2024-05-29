Genezio project that uses refine.dev as a front-end with Genezio in the backend. Integrated some basic classes as well as Genezio-based authentication.

You can play with it here: https://beige-mild-gull.app.genez.io/

Usage:

1. Create a Genezio project (FullStack, using React / TypeScrypt) 
2. Create a Refine.dev project in the client folder
3. npm install refine-genezio (in the client folder)
4. Update the App.tsx file:
```
...
import dataProvider from "refine-genezio";
import * as gsdk from "@genezio-sdk/PROJECT_NAME";
...
<Refine dataProvider={dataProvider(gsdk)}...>
...
```
5. If your app uses authentication, copy the "/client/src/authProvider.ts" to your Refine project
