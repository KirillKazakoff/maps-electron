import childProcess from 'child_process';
import { getDirPathes } from '../xml/fsModule/fsPathes';

// 'C:\\RunFlow.ps1'
type Props = {
    filePath: string;
    log: string;
};

const powerhellPath = getDirPathes().powershell;

export const startProcessPA = ({ filePath, log }: Props) => {
    const path = powerhellPath + filePath;
    console.log(path);
    childProcess.spawn(path, { shell: 'powershell.exe' });
    console.log(log);
};
