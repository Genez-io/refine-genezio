# Description

This exemplifies a web admin interface that uses refine as a front-end and Genezio in the backend. It exposes some genezio classes as well as Genezio-based authentication. It uses a Postgres database for data storage.

You can play with it here: https://scarlet-male-mink.app.genez.io/

# Deploying this example

1. Clone this repository locally
2. `cd example-postgres`
3. Install genezio with `npm install -g genezio`
4. Deploy the project with `genezio deploy`
5. Go to the Genezio App in your broser by accessing https://app.genez.io/ and choose your project
6. Create and link a new Posgres database (call it "demo") from the Databases section of your project.
7. Enable Authentication by choosing "Authentication" on the left-side menu (reuse the database you just created), and enable the Email provider
8. Make sure you update the reset password URL from Authentication / Settings / Email Templates / Reset Password to `https://ABC-DEF-GHI.app.genez.io/reset-password` (you'll find your domain name under the Domains section)
9. Update the auth token / region in the `client/src/authProvider.ts` file with the ones provided by Genezio - you can find them in the above Authentication section
10. Redeploy the genezio project by running `genezio deploy` again
11. Go to `https://ABC-DEF-GHI.app.genez.io/` again and test the project in your browser

If you want to test Genezio and Refine locally:

12. Create a `.env` file in the `/server/` folder and save the database connection URL in the file as follows:

`DEMO_DATABASE_URL=postgresql://admin:<PASSWORD>@<POSTGRES_DOMAIN>/demo?sslmode=require`

You can get the postgres connection string form the genezio app / databases / select your database / connect

13. run `genezio local` on the project root folder
