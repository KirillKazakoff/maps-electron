import { ProductionInputT } from './parseProdInput';
import { ProductionOutputT } from './parseProdOutput';

type SettingsT = { input: ProductionInputT[]; output: ProductionOutputT[] };

export const modifyCoefficientSpecial = ({ input, output }: SettingsT) => {
    output.forEach((o) => {
        const isSpecial = o.name.includes('икра') || o.name.includes('молоки');

        if (isSpecial) {
            const pollock = input.find((i) => i.name.includes('минтай'));
            if (!pollock) return;
            console.log(pollock.total);
            o.coefficient = +((o.total / pollock.total) * 100).toFixed(2);
        }
    });
};
