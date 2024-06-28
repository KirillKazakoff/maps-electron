/* eslint-disable no-console */
export const setLoggingTrace = () => {
    ['log', 'warn', 'error'].forEach((methodName) => {
        const myConsole = console as any;
        const originalMethod = myConsole[methodName];

        myConsole[methodName] = (...args: any) => {
            let initiator = 'unknown place';
            try {
                throw new Error();
            } catch (e: any) {
                if (typeof e.stack === 'string') {
                    let isFirst = true;
                    for (const line of e.stack.split('\n')) {
                        const matches = line.match(/^\s+at\s+(.*)/);
                        if (matches) {
                            if (!isFirst) {
                                // first line - current function
                                // second line - caller (what we are looking for)
                                initiator = matches[1];
                                break;
                            }
                            isFirst = false;
                        }
                    }
                }
            }
            originalMethod.apply(console, [...args, '\n', `  at ${initiator}`]);
        };
    });
};
