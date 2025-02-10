import React, { useState } from 'react';
import { Carousel } from 'antd';
import FlashCard from './FlashCard';

const FlashCardList = ({ data, sourceLang }) => {
    const [incorrectCardIds, setIncorrectCardIds] = useState([]);
    const [correctCardIds, setCorrectCardIds] = useState([]);

    const handleUpdateResults = ({ isSuccess, termId }) => {
        isSuccess
            ? setCorrectCardIds([...correctCardIds, termId])
            : setIncorrectCardIds([...incorrectCardIds, termId]);
    };

    return (
        <div>
            <Carousel arrows infinite={false} className='carousel'>
                {sourceLang === 'korean' &&
                    data.koreanTerms.map((r) => {
                        return (
                            <div className='center-carousel-content' key={r.id}>
                                <FlashCard
                                    termId={r.id}
                                    question={r.term}
                                    answer={r.english.term}
                                    inputGhostText='English Translation'
                                    updateResultsHandler={handleUpdateResults}
                                    showAudioIcon={true}
                                    totalCards={data.koreanTerms.length}
                                    totalCorrect={correctCardIds.length}
                                    totalIncorrect={incorrectCardIds.length}
                                />
                            </div>
                        );
                    })}

                {sourceLang === 'english' &&
                    data.englishTerms.map((r) => {
                        return (
                            <div className='center-carousel-content' key={r.id}>
                                <FlashCard
                                    termId={r.id}
                                    question={r.term}
                                    answer={r.korean.term}
                                    inputGhostText='Korean Translation'
                                    updateResultsHandler={handleUpdateResults}
                                    showAudioIcon={false}
                                    totalCards={data.englishTerms.length}
                                    totalCorrect={correctCardIds.length}
                                    totalIncorrect={incorrectCardIds.length}
                                />
                            </div>
                        );
                    })}
            </Carousel>
        </div>
    );
};

export default FlashCardList;
