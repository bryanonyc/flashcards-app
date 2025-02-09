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

### Create Hidden Environment File

Create a `.env` file in the project root with the following environment variables:

-   `REACT_APP_API_ENDPOINT_BASE_URL=http://localhost:4000`
-   `REACT_APP_GRAPHQL_API_ENDPOINT=http://localhost:4000/graphql`

### Start The Servver

Open a terminal and type: `npm start`
