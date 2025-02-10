import { REFRESH_URL } from '../api/endpoints';

export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

export const setAccessToken = (token) => {
    sessionStorage.setItem('accessToken', token);
};

export const removeAccessToken = () => {
    sessionStorage.removeItem('accessToken');
};

export const refreshAccessToken = async () => {
    const response = await fetch(REFRESH_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
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
