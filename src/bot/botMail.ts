import { MessageInfoT } from '../nodeMailer/parseMail';
import { messagesUrl, readJson } from '../nodeMailer/addMailListener';
import { DateTime } from 'luxon';

const getDTMessages = (messages: MessageInfoT[]) => {
    return messages.filter((msg) => {
        const isDT = msg.subject.toLowerCase().includes('дт');
        const isBrokers = msg.from.toLowerCase().includes('cdomager@gmail.com');

        return isDT && isBrokers;
    });
};

const checkDt = (msg: MessageInfoT, messages: MessageInfoT[]) => {
    messages.forEach((msg) => {
        const isAttachment = msg.attachments.some((attachment) =>
            attachment.toLowerCase().includes('доп')
        );
        const isOvedSender = msg.from.includes('oved');
        if (!isOvedSender || !isAttachment) return;

        const dtMessages = getDTMessages(messages);
    });
};

export const botMail = () => {
    const messages = readJson(messagesUrl) as MessageInfoT[];

    const now = DateTime.now();

    messages.forEach((msg) => {
        const date = DateTime.fromISO(msg.date);

        const difference = date.diffNow('day').days.toFixed();
        // console.log(difference + ': day');
    });
};
