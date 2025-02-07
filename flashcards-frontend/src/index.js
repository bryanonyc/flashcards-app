import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { App as AntdApp } from 'antd';
import { GRAPHQL_API_URL } from './features/api/endpoints.js';

const apolloClient = new ApolloClient({
    uri: GRAPHQL_API_URL,
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
