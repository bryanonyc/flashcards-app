import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '../auth/auth.js';

export const useAuth = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const { username, isAdmin } = decodedToken;
        return { username, isAdmin };
    } else {
        return { username: '', isAdmin: false };
    }
};
