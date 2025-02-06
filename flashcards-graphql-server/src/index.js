// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/typeDefs/typedefs.js';
import { resolvers } from './graphql/resolvers/resolvers.js';
import { corsOptions } from './config/corsOptions.js';

// Required logic for integrating with Express
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 4000;

const bootstrapServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/graphql', expressMiddleware(server));

    // app.get("/", (req, res) => {
    //     res.send("Hello World!");
    // });

    app.listen(port, () => {
        console.log(`🚀 Express ready at http://localhost:${port}`);
        console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
    });
};

bootstrapServer();
