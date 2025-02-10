import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { isNotNil } from 'ramda';
import { removeAccessToken } from '../auth/auth';
import { LOGOUT_URL } from '../api/endpoints';

const AdminMenu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { username } = useAuth();

    const gotoLogin = () => {
        navigate('/login');
    };

    const gotoTranslations = () => {
        navigate('/translations');
    };

    const handleButtonClick = (sourceLanguage) => {
        navigate(`/cards?source=${sourceLanguage}`);
    };
    const handleLogout = async () => {
        const response = await fetch(LOGOUT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();
        setIsLoggedIn(false);
        removeAccessToken();
        navigate('/');
    };

    const userAvatar = (
        <Avatar style={{ backgroundColor: '#f56a00' }} size='small'>
            {isLoggedIn && username.charAt(0).toUpperCase()}
        </Avatar>
    );

    const baseItems = [
        {
            key: 'flashcards',
            label: 'Study Flashcards',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'korean',
            label: (
                <Button
                    type='link'
                    onClick={() => handleButtonClick('korean')}
                    size='small'
                >
                    Answer In English
                </Button>
            ),
        },
        {
            key: 'english',
            label: (
                <Button
                    type='link'
                    onClick={() => handleButtonClick('english')}
                    size='small'
                >
                    Answer In 한국어
                </Button>
            ),
        },
        {
            type: 'divider',
        },
    ];

    let additionalItems = [];

    if (isLoggedIn) {
        additionalItems = [
            {
                key: 'translations',
                label: (
                    <Button
                        type='link'
                        onClick={gotoTranslations}
                        block
                        size='small'
                    >
                        Manage Translations
                    </Button>
                ),
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: (
                    <Button
                        type='primary'
                        block
                        onClick={handleLogout}
                        style={{ backgroundColor: 'green' }}
                        l
                        size='small'
                    >
                        Log Out
                    </Button>
                ),
            },
        ];
    } else {
        additionalItems = [
            {
                key: 'login',
                label: (
                    <Button
                        type='primary'
                        block
                        onClick={gotoLogin}
                        style={{ backgroundColor: 'green' }}
                        size='small'
                    >
                        Log In
                    </Button>
                ),
            },
        ];
    }

    const items = baseItems.concat(additionalItems);

    useEffect(() => {
        const loggedIn = isNotNil(username) && username !== '';
        setIsLoggedIn(loggedIn);
    }, [username]);

    return (
        <Space>
            {isLoggedIn && userAvatar}
            <Dropdown menu={{ items }} arrow>
                <MenuOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
        </Space>
    );
};

export default AdminMenu;
