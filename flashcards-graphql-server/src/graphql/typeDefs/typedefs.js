export const typeDefs = `#graphql
    type English {
        id: ID!
        term: String!
        korean_id: ID
        korean: Korean
    }
    type Korean {
        id: ID!
        term: String!
        english_id: ID
        english: English
    }
    type Query {
        englishTerms: [English]
        englishTerm(term: String!): English
        koreanTerms: [Korean]
        koreanTerm(term: String!): Korean
    }
    type Mutation {
        createTranslation(translationInput: CreateTranslationInput): English
        deleteTranslation(englishId: ID!, koreanId: ID): [English]
        updateEnglish(englishId: ID!, term: String!): English
        updateKorean(koreanId: ID!, term: String!): Korean
    }
    input CreateTranslationInput {
        englishTerm: String!
        koreanTerm: String!
    }
`;
