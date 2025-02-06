import { isNil } from 'ramda';
import { prisma } from '../../db.js';
import { shuffle } from '../../utils/Array.js';

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
        async createTranslation(_, args) {
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
                console.log(englishRecord);

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
        },
        async deleteTranslation(_, args) {
            const englishId = Number(args.englishId);
            console.log(englishId);
            await prisma.english.delete({
                where: {
                    id: englishId,
                },
            });

            return prisma.english.findMany();
        },
        async updateEnglish(_, args) {
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
        },
        async updateKorean(_, args) {
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
        },
    },
};
