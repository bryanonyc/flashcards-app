import React, { useEffect, useRef, useState } from 'react';
import { getAccessToken, setAccessToken } from './auth';
import { REFRESH_URL } from '../api/endpoints';
import { FORBIDDEN_403 } from '../components/Results';
import { Outlet } from 'react-router-dom';

const ValidateAuthorization = () => {
    const accessToken = getAccessToken();
    const effectRan = useRef(false);
    const [isRefreshError, setIsRefreshError] = useState(false);

    useEffect(() => {
        if (effectRan.current || process.env.NODE_ENV !== 'development') {
            const refreshAccessToken = async () => {
                const response = await fetch(REFRESH_URL, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setAccessToken(data.accessToken);
                } else {
                    setIsRefreshError(true);
                }
            };

            if (!accessToken) {
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
            <div className='center-content'>
                <FORBIDDEN_403 />
            </div>
        );
    } else {
        content = <Outlet />;
    }

    return <>{content}</>;
};

export default ValidateAuthorization;
