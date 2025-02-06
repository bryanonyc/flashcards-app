export const shuffle = (original) => {
    const copy = [...original];
    for (let i = 0; i < copy.length; i++) {
        const randomIdx = Math.floor(Math.random() * copy.length);
        const current = copy[i];
        const random = copy[randomIdx];
        // swap
        const temp = current;
        copy[i] = random;
        copy[randomIdx] = temp;
    }
    return copy;
};
