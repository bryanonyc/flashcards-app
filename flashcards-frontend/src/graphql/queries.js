import { gql } from '@apollo/client';

export const GET_ENGLISH_TERMS = gql`
    query {
        englishTerms {
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

export const GET_KOREAN_TERMS = gql`
    query {
        koreanTerms {
            id
            term
            english_id
            english {
                id
                term
            }
        }
    }
`;
