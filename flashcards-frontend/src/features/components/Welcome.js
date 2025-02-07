import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Button } from 'antd';

const Welcome = () => {
    const navigate = useNavigate();

    const handleButtonClick = (sourceLanguage) => {
        navigate(`/cards?source=${sourceLanguage}`);
    };

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
            </div>
        </div>
    );
};

export default Welcome;
