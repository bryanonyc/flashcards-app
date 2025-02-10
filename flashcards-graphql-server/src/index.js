// npm install @apollo/server express graphql cors
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/typeDefs/typedefs.js';
import { resolvers } from './graphql/resolvers/resolvers.js';
import { corsOptions } from './config/corsOptions.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import rootRouter from './routes/root.js';
import ttsRouter from './routes/ttsRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    app.use(logger);
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', rootRouter);
    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: ({ req, res }) => {
                return { req, res };
            },
        })
    );
    app.use('/auth', authRouter);
    app.use('/tts-korean', ttsRouter);

    app.all('*', (req, res) => {
        res.status(404);
        if (req.accepts('json')) {
            res.json({ message: '404 Not Found' });
        } else if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, 'views', '404.html'));
        } else {
            res.type('txt').send('404 Not Found');
        }
    });

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`🚀 Express ready at http://localhost:${port}`);
        console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
    });
};

bootstrapServer();
