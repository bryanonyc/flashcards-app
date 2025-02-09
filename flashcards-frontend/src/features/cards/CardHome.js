import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Spin } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { GET_ENGLISH_TERMS, GET_KOREAN_TERMS } from '../../graphql/queries';
import FlashCardList from './FlashCardList';
import StudyResults from '../components/StudyResults';

const CardHome = () => {
    const [incorrectCardIds, setIncorrectCardIds] = useState([]);
    const [correctCardIds, setCorrectCardIds] = useState([]);

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

    const handleUpdateResults = ({ isSuccess, termId }) => {
        isSuccess
            ? setCorrectCardIds([...correctCardIds, termId])
            : setIncorrectCardIds([...incorrectCardIds, termId]);
    };

    return (
        <>
            {sourceLang === 'korean' && koreanQueryData && (
                <>
                    <StudyResults
                        correct={correctCardIds.length}
                        incorrect={incorrectCardIds.length}
                        total={koreanQueryData.koreanTerms.length}
                    />

                    <FlashCardList
                        data={koreanQueryData}
                        sourceLang={sourceLang}
                        updateResultsHandler={handleUpdateResults}
                    />
                </>
            )}

            {sourceLang === 'english' && englishQueryData && (
                <>
                    <StudyResults
                        correct={correctCardIds.length}
                        incorrect={incorrectCardIds.length}
                        total={englishQueryData.englishTerms.length}
                    />

                    <FlashCardList
                        data={englishQueryData}
                        sourceLang={sourceLang}
                        updateResultsHandler={handleUpdateResults}
                    />
                </>
            )}
        </>
    );
};

export default CardHome;
