import React, { useState } from 'react';
import { Alert, Button, Card, Input } from 'antd';
import AudioPlayer from '../audio/AudioPlayer';

const FlashCard = ({
    termId,
    question,
    answer,
    inputGhostText,
    updateResultsHandler,
    showAudioIcon,
}) => {
    const [isCorrect, setIsCorrect] = useState(null);
    const [translation, setTranslation] = useState('');

    const checkResult = () => {
        const result = {
            isSuccess: translation.toLowerCase() === answer.toLowerCase(),
            termId,
        };

        updateResultsHandler(result);

        setIsCorrect(translation.toLowerCase() === answer.toLowerCase());
    };
    const handleInputChange = (event) => {
        const userInput = event.target.value;
        if (userInput === '') {
            setIsCorrect(null);
        }
        setTranslation(userInput);
    };

    const cardActions = [
        <Button
            type='primary'
            onClick={checkResult}
            disabled={isCorrect !== null || translation === ''}
        >
            Submit
        </Button>,
    ];

    if (showAudioIcon) {
        cardActions.unshift(<AudioPlayer term={question} />);
    }

    return (
        <>
            <div className='center-content'>
                <Card
                    title={isCorrect !== null && <h2>{answer}</h2>}
                    actions={cardActions}
                    className='flashcard'
                >
                    {isCorrect === true && (
                        <Alert message='Correct' type='success' showIcon />
                    )}
                    {isCorrect === false && (
                        <Alert message='Incorrect' type='error' showIcon />
                    )}

                    <h1>{question}</h1>
                    <Input
                        placeholder={inputGhostText}
                        onChange={handleInputChange}
                        disabled={isCorrect !== null}
                        onPressEnter={checkResult}
                    />
                </Card>
            </div>
        </>
    );
};

export default FlashCard;
