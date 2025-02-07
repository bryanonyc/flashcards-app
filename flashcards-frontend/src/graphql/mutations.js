import { gql } from '@apollo/client';

export const UPDATE_ENGLISH_TERM = gql`
    mutation UpdateEnglish($englishId: ID!, $term: String!) {
        updateEnglish(englishId: $englishId, term: $term) {
            id
            term
            korean {
                english_id
                term
            }
        }
    }
`;

export const UPDATE_KOREAN_TERM = gql`
    mutation UpdateKorean($koreanId: ID!, $term: String!) {
        updateKorean(koreanId: $koreanId, term: $term) {
            id
            term
            english {
                korean_id
                term
            }
        }
    }
`;

export const CREATE_TRANSLATION = gql`
    mutation CreateTranslation($translationInput: CreateTranslationInput!) {
        createTranslation(translationInput: $translationInput) {
            id
            term
            korean_id
            korean {
                id
                term
                english_id
            }
        }
    }
`;

export const DELETE_TRANSLATION = gql`
    mutation DeleteTranslation($englishId: ID!) {
        deleteTranslation(englishId: $englishId) {
            id
            term
            korean_id
            korean {
                id
                term
            }
        }
    }
`;
