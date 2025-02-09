# Flashcards

This is an app to learn Korean. The stack used is:

-   **React**
-   **Ant Design**
-   **Node.js**
-   **Expres**
-   **Apollo**
-   **GraphQL**
-   **Prisma**
-   **Postgres**

It features the abilty to answer the flashcards in either English or Korean. In addition Google Cloud Text to Speech is used to play the Korean term.

Administrators can perform full CRUD operations to manage the translations.

You can access the app [here.](https://bryano-korean-flashcards.onrender.com/)

Scroll down for instructions on how to run locally.

## Features

-   **Backend**: Node.js leveraging Express and Apollo. Exposes a REST API and a GraphQL endpoint to query the database
-   **Database**: Postgres database containing the translations.
-   **Frontend**: React application leveraing Ant Design and Apollo client to query the backend.

## Local Environment Setup

### Create JWT Secret Keys

Create two secret keys for the access token and refresh tokens. Follow the steps below and copy values into environment variables.

Open terminal and type `node` and then type: `require(‘crypto’).randomBytes(64).toString(‘hex’)`

Copy the generated value and put into the `ACCESS_TOKEN_SECRET` environemnt variable.

Repeat above steps to generate a new token and put that value into `REFRESH_TOKEN_SECRET` environment variable

### Create Hidden Environment File

Create a `.env` file in the project root with the following environment variables:

-   `NODE_ENV=development`
-   `DATABASE_URL=[YOUR_DB_URL]`
-   `ACCESS_TOKEN_SECRET=[GENERATE_SECRET]`
-   `REFRESH_TOKEN_SECRET=[GENERATE_SECRET]`
-   `ACCESS_TOKEN_EXPIRES_IN="15m"`
-   `REFRESH_TOKEN_EXPIRES_IN="60m"`
-   `GOOGLE_TTS_API_ENDPOINT="https://texttospeech.googleapis.com/v1beta1/text:synthesize"`
-   `GOOGLE_TTS_API_KEY=[YOUR_TTS_API_KEY]`

You will need a Google Text To Speech API Key.

Feel free to change the values for the token expiration.

### Deploy Prisma Schema To Database

Open terminal and type `npx prisma db push`

### Start The Servver

Open a terminal and type: `npm run dev`
