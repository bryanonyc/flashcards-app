import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Button } from 'antd';
import { isNotNil } from 'ramda';
import { useAuth } from '../hooks/useAuth';

const Welcome = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { username } = useAuth();

    const handleButtonClick = (sourceLanguage) => {
        navigate(`/cards?source=${sourceLanguage}`);
    };

    useEffect(() => {
        const loggedIn = isNotNil(username) && username !== '';
        setIsLoggedIn(loggedIn);
    }, [username]);

    return (
        <div className='center-content'>
            <div className={'body-container'}>
                <div>Study Korean with flashcards. Get started below.</div>
            </div>
            <div className={'home-button-container'}>
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleButtonClick('korean')}
                    >
                        Answer In English
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => handleButtonClick('english')}
                    >
                        Answer In 한국어
                    </Button>
                </Space>
                {isLoggedIn && <div>You're logged in as: {username}</div>}
            </div>
        </div>
    );
};

export default Welcome;
