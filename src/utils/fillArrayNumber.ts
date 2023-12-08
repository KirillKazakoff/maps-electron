export const fillArrayNumber = (start: number, end: number) => {
    const res: number[] = [];
    for (let i = start; i < end; i += 1) {
        res.push(i);
    }
    return res;
};
