import React, { useEffect, useState } from 'react';
import { SoundTwoTone } from '@ant-design/icons';
import { TEXT_TO_SPEECH_KOREAN_URL } from '../api/endpoints.js';
import { App } from 'antd';

const AudioPlayer = ({ term }) => {
    const { message: antdMessage } = App.useApp();

    const [audio, setAudio] = useState(null);

    const fetchAudio = async () => {
        try {
            const response = await fetch(TEXT_TO_SPEECH_KOREAN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: term,
                }),
            });

            const data = await response.json();

            const decoded = atob(data.audioContent);
            // Convert to an array buffer
            const byteArray = new Uint8Array(decoded.length);
            for (let i = 0; i < decoded.length; i++) {
                byteArray[i] = decoded.charCodeAt(i);
            }

            // Create a Blob from the byte array and generate a URL for it
            const blob = new Blob([byteArray], { type: 'audio/mpeg' }); // Or 'audio/wav', depending on your format
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            setAudio(audio);
        } catch (error) {
            antdMessage.error(`Could not fetch audio. ${error.message}`, 5);
        }
    };

    const playAudio = () => {
        audio === null ? fetchAudio() : audio.play();
    };

    useEffect(() => {
        if (audio != null) {
            audio.play();
        }
    }, [audio]);

    return <SoundTwoTone onClick={playAudio} style={{ fontSize: '1.5rem' }} />;
};

export default AudioPlayer;
