import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '../auth/auth.js';

export const useAuth = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        console.log('decodedToken', decodedToken);
        const { username, isAdmin } = decodedToken;
        return { username, isAdmin };
    } else {
        return { username: '', isAdmin: false };
    }
};
