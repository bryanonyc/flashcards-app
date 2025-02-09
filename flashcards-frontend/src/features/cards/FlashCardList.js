import React from 'react';
import { Carousel } from 'antd';
import FlashCard from './FlashCard';

const FlashCardList = ({ data, sourceLang, updateResultsHandler }) => {
    const handleResultsUpdate = ({ isSuccess, termId }) => {
        updateResultsHandler({ isSuccess, termId });
    };

    return (
        <div>
            <Carousel
                arrows
                infinite={false}
                style={{
                    backgroundColor: 'darkgray',
                    minHeight: '75vh',
                }}
            >
                {sourceLang === 'korean' &&
                    data.koreanTerms.map((r) => {
                        return (
                            <div className='center-carousel-content' key={r.id}>
                                <FlashCard
                                    termId={r.id}
                                    question={r.term}
                                    answer={r.english.term}
                                    inputGhostText='English Translation'
                                    updateResultsHandler={handleResultsUpdate}
                                    showAudioIcon={true}
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
                                    updateResultsHandler={handleResultsUpdate}
                                    showAudioIcon={false}
                                />
                            </div>
                        );
                    })}
            </Carousel>
        </div>
    );
};

export default FlashCardList;
