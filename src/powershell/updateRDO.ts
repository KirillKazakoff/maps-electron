import fs from 'fs';

const path = {
    from: '\\\\Storage\\seawolf\\FLOT\\BUSHUEV\\КВОТЫ\\2025 квоты\\РАБОТА СУДОВ\\РАЗРЕШЕНИЯ',
    to: 'C:\\Users\\admin\\iCloudDrive\\ТАМОЖНЯ\\2025\\РАЗРЕШЕНИЯ',
};

export const updateRDO = () => {
    console.log('hello');
    const fileNames = {
        from: fs.readdirSync(path.from, { withFileTypes: true }),
        to: fs.readdirSync(path.to, { withFileTypes: true }),
    };

    // remove previous rdo files in icloud
    fileNames.to.forEach((file) => {
        const dirPath = `${path.to}\\${file.name}`;
        fs.rmSync(dirPath, { recursive: true, force: true });
    });

    // copy folders from flot folder to icloud
    fileNames.from.forEach((file) => {
        const srcPath = `${path.from}\\${file.name}`;
        const destPath = `${path.to}\\${file.name}`;

        fs.cp(srcPath, destPath, { recursive: true }, (e) => {
            if (e) console.log(e);
            return;
        });
    });
};
