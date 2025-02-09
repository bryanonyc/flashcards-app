import { REFRESH_URL } from '../api/endpoints';

export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

export const setAccessToken = (token) => {
    sessionStorage.setItem('accessToken', token);
    console.log('set access token', sessionStorage);
};

export const removeAccessToken = () => {
    sessionStorage.removeItem('accessToken');
    console.log('removed access token', sessionStorage);
};

export const refreshAccessToken = async () => {
    console.log('refreshing access token');
    const response = await fetch(REFRESH_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        console.log('new token ', data);
        setAccessToken(data.accessToken);
        return true;
    }

    if (data.isError && data.message.includes('No token found')) {
        return false;
    }
};

export const setContext = (refetchQueries) => {
    const context = {
        context: {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            fetchOptions: {
                credentials: 'include',
            },
        },
    };

    if (refetchQueries) {
        context.refetchQueries = refetchQueries;
    }

    return context;
};
