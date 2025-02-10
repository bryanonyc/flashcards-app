import React, { useEffect, useRef, useState } from 'react';
import { getAccessToken, setAccessToken } from './auth';
import { REFRESH_URL } from '../api/endpoints';
import { FORBIDDEN_403 } from '../components/Results';
import { Outlet } from 'react-router-dom';

const ValidateAuthorization = () => {
    const accessToken = getAccessToken();
    console.log('at', accessToken);
    const effectRan = useRef(false);
    const [isRefreshError, setIsRefreshError] = useState(false);

    useEffect(() => {
        console.log('useEffect -> effectRan.current', effectRan.current);
        if (effectRan.current) {
            const refreshAccessToken = async () => {
                console.log('useEffect -> fetch');
                const response = await fetch(REFRESH_URL, {
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('useEffect -> data', data);
                if (response.ok) {
                    setAccessToken(data.accessToken);
                } else {
                    setIsRefreshError(true);
                }
            };

            if (!accessToken) {
                console.log('refreshing');
                refreshAccessToken();
            }
        }

        return () => {
            console.log('set effect ran to true');
            effectRan.current = true;
        };
    });

    let content;

    console.log('isRefreshError', isRefreshError);
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
