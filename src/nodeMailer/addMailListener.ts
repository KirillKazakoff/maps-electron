import { simpleParser } from 'mailparser';
import Pop3Command from 'node-pop3';
import fs from 'fs';
import { MessageInfoT, parseMessage } from './parseMail';
import { getConfig } from '../puppeteer/fsModule/readConfig';

const mailUIDLUrl =
    'C:\\Users\\admin\\Desktop\\Repo\\maps-electron\\src\\nodeMailer\\mailUIDL.json';
export const messagesUrl =
    'C:\\Users\\admin\\Desktop\\Repo\\maps-electron\\src\\nodeMailer\\mailMessages.json';

export const readJson = (url: string) => JSON.parse(fs.readFileSync(url).toString());

export const addMailListener = async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const config = getConfig();
    const pop3 = new Pop3Command(config.mail);

    const messagesStored = readJson(messagesUrl) as MessageInfoT[];
    const uidlFetched = (await pop3.UIDL()) as string[][];
    const uidlStored = readJson(mailUIDLUrl) as string[][];

    const newMessages = uidlFetched.filter((rowFetched) => {
        const isAlreadyStored = uidlStored.some((rowStored) => rowFetched[1] === rowStored[1]);
        return !isAlreadyStored;
    });

    for await (const [msgNumber, id] of newMessages) {
        console.log(msgNumber);
        const msg = await pop3.RETR(+msgNumber);
        const newMessage = parseMessage(await simpleParser(msg), id);
        if (newMessage) {
            const isSameIn = messagesStored.some((msg) => msg.id === id);
            if (isSameIn) continue;
            messagesStored.push(newMessage);
        }
    }

    console.log(messagesStored);
    await pop3.QUIT();

    // write uid and specific messages
    fs.writeFileSync(mailUIDLUrl, JSON.stringify(uidlFetched));
    fs.writeFileSync(messagesUrl, JSON.stringify(messagesStored));
};
