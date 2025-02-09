import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
} from '@apollo/client';
import { App as AntdApp } from 'antd';
import { GRAPHQL_API_URL } from './features/api/endpoints.js';

const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
    credentials: 'include', // Include credentials in requests
});

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AntdApp>
            <ApolloProvider client={apolloClient}>
                <App />
            </ApolloProvider>
        </AntdApp>
    </React.StrictMode>
);
