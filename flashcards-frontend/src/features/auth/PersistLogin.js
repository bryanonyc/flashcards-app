import React, { useEffect, useRef, useState } from 'react';
import { getAccessToken, setAccessToken } from './auth';
import { REFRESH_URL } from '../api/endpoints';
import { FORBIDDEN_403 } from '../components/Results';
import { Outlet } from 'react-router-dom';

const PersistLogin = () => {
    const accessToken = getAccessToken();
    console.log('accessToken', accessToken);
    const effectRan = useRef(false);
    const [isRefreshError, setIsRefreshError] = useState(false);

    useEffect(() => {
        if (effectRan.current) {
            const refreshAccessToken = async () => {
                console.log('refreshing access token');
                const response = await fetch(REFRESH_URL, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('new token ', data);
                    setAccessToken(data.accessToken);
                } else {
                    console.log('refresh error');
                    setIsRefreshError(true);
                }
            };

            if (!accessToken) {
                console.log('refreshing()');
                refreshAccessToken();
            }
        }

        return () => {
            effectRan.current = true;
        };
    });

    let content;

    if (isRefreshError) {
        //token: no
        content = (
            <div className='login-container'>
                <FORBIDDEN_403 />
            </div>
        );
    } else {
        content = <Outlet />;
    }

    return <>{content}</>;
};

export default PersistLogin;
