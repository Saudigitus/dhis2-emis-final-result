// fromPairs transforms an array of key-value pairs into an object.
export const fromPairs = <T>(pairs: Array<[string, T]>): Record<string, T> => {
    return pairs.reduce<Record<string, T>>((accumulator, [key, value]) => {
        accumulator[key] = value;
        return accumulator;
    }, {});
}