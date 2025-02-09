import { prisma } from '../../db.js';
import { shuffle } from '../../utils/Array.js';
import { verifyJWT } from '../../middleware/verifyJWT.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        async englishTerms() {
            const results = await prisma.english.findMany();
            return shuffle(results);
        },
        async englishTerm(_, args) {
            return await prisma.english.findFirst({
                where: {
                    term: {
                        equals: args.term,
                        mode: 'insensitive',
                    },
                },
            });
        },
        async koreanTerms() {
            const results = await prisma.korean.findMany();
            return shuffle(results);
        },
        async koreanTerm(_, args) {
            return await prisma.korean.findFirst({
                where: {
                    term: args.term,
                },
            });
        },
    },
    English: {
        async korean(parent) {
            return await prisma.korean.findFirst({
                where: {
                    english_id: parent.id,
                },
            });
        },
    },
    Korean: {
        async english(parent) {
            return await prisma.english.findFirst({
                where: {
                    korean_id: parent.id,
                },
            });
        },
    },
    Mutation: {
        async createTranslation(_, args, context) {
            const { req, res } = context;

            try {
                await verifyJWT(req, res);

                const englishTerm = args.translationInput.englishTerm;
                const koreanTerm = args.translationInput.koreanTerm;
                return prisma.$transaction(async (tx) => {
                    const englishRecord = await tx.english.create({
                        data: {
                            term: englishTerm,
                        },
                        select: {
                            id: true,
                            term: true,
                        },
                    });

                    const koreanRecord = await tx.korean.create({
                        data: {
                            term: koreanTerm,
                            english_id: englishRecord.id,
                        },
                        select: {
                            id: true,
                        },
                    });

                    await tx.english.update({
                        where: {
                            id: englishRecord.id,
                        },
                        data: {
                            korean_id: koreanRecord.id,
                        },
                    });
                    return englishRecord;
                });
            } catch (error) {
                const message = `${error.status}: ${error.message}`;
                throw new GraphQLError(message);
            }
        },
        async deleteTranslation(_, args, context) {
            const { req, res } = context;

            try {
                await verifyJWT(req, res);

                const englishId = Number(args.englishId);
                await prisma.english.delete({
                    where: {
                        id: englishId,
                    },
                });

                return prisma.english.findMany();
            } catch (error) {
                const message = `${error.status}: ${error.message}`;
                throw new GraphQLError(message);
            }
        },
        async updateEnglish(_, args, context) {
            const { req, res } = context;

            try {
                await verifyJWT(req, res);

                const englishId = Number(args.englishId);
                const term = args.term;
                return await prisma.english.update({
                    where: {
                        id: englishId,
                    },
                    data: {
                        term,
                    },
                    select: {
                        id: true,
                        term: true,
                    },
                });
            } catch (error) {
                const message = `${error.status}: ${error.message}`;
                throw new GraphQLError(message);
            }
        },
        async updateKorean(_, args, context) {
            const { req, res } = context;

            try {
                await verifyJWT(req, res);

                const koreanId = Number(args.koreanId);
                const term = args.term;
                return await prisma.korean.update({
                    where: {
                        id: koreanId,
                    },
                    data: {
                        term,
                    },
                    select: {
                        id: true,
                        term: true,
                    },
                });
            } catch (error) {
                const message = `${error.status}: ${error.message}`;
                throw new GraphQLError(message);
            }
        },
    },
};
