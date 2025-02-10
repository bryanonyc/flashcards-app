import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Spin } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { GET_ENGLISH_TERMS, GET_KOREAN_TERMS } from '../../graphql/queries';
import FlashCardList from './FlashCardList';

const CardHome = () => {
    const [
        getEnglishCards,
        {
            called: englishQueryCalled,
            loading: enqlishQueryLoading,
            error: englishQueryError,
            data: englishQueryData,
        },
    ] = useLazyQuery(GET_ENGLISH_TERMS);

    const [
        getKoreanCards,
        {
            called: koreanQueryCalled,
            loading: koreanQueryLoading,
            error: koreanQueryError,
            data: koreanQueryData,
        },
    ] = useLazyQuery(GET_KOREAN_TERMS);

    const location = useLocation();
    const sourceLang = new URLSearchParams(location.search).get('source');

    if (sourceLang === 'english' && !englishQueryCalled) {
        getEnglishCards();
    } else if (sourceLang === 'korean' && !koreanQueryCalled) {
        getKoreanCards();
    }

    if (enqlishQueryLoading || koreanQueryLoading) {
        return (
            <div className='center-content'>
                <Spin />
            </div>
        );
    }

    if (englishQueryError) {
        return (
            <div className='center-content'>
                <Alert
                    message={`Error: ${englishQueryError.message}`}
                    type='error'
                    showIcon
                />
            </div>
        );
    } else if (koreanQueryError) {
        return (
            <div className='center-content'>
                <Alert
                    message={`Error: ${koreanQueryError.message}`}
                    type='error'
                    showIcon
                />
            </div>
        );
    }

    return (
        <>
            {sourceLang === 'korean' && koreanQueryData && (
                <>
                    <FlashCardList
                        data={koreanQueryData}
                        sourceLang={sourceLang}
                    />
                </>
            )}

            {sourceLang === 'english' && englishQueryData && (
                <>
                    <FlashCardList
                        data={englishQueryData}
                        sourceLang={sourceLang}
                    />
                </>
            )}
        </>
    );
};

export default CardHome;
