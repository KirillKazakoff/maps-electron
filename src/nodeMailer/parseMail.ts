import { isArray } from 'lodash';
import { ParsedMail } from 'mailparser';

export const isBrokerMail = (parsed: ParsedMail, to: string) => {
    const addresses = ['C major', 'Брокеры', 'cdomager@gmail.com'];

    return addresses.some((address) => {
        return [parsed.from.text.includes(address), to.includes(address)].some(
            (condition) => condition
        );
    });
};

export const parseAttachments = (attachments: ParsedMail['attachments']) => {
    if (!attachments) return [];

    return attachments.reduce<string[]>((total, attachment) => {
        total.push(attachment.filename);
        return total;
    }, []);
};

export const parseMessageType = (msg: {
    from: string;
    attachments: string[];
    subject: string;
}) => {
    const isDocType = (type: string) =>
        msg.attachments.some((attachment) => attachment.toLowerCase().includes(type));
    const isAgreement = isDocType('доп');
    const isCertificate = isDocType('!!!');

    const isOvedSender = msg.from.includes('oved');
    if (isOvedSender && isAgreement) return 'DTStart';
    if (!isOvedSender && isCertificate) return 'Certificate_draft';
    if (!isOvedSender && msg.subject?.includes('ДТ')) return 'DTFinish';

    return '';
};

export const parseMessage = (mail: ParsedMail, id: string) => {
    const { subject, date, text, from, to } = mail;
    const addressesTo = isArray(to) ? to.map((address) => address.text).join(' ') : to.text;
    console.log(subject);

    const attachments = parseAttachments(mail.attachments);
    const type = parseMessageType({ from: from.text, attachments, subject });

    if (!isBrokerMail(mail, addressesTo) || !type) return null;
    console.log('broker mail found');

    return {
        date: date.toISOString(),
        subject,
        text,
        from: from.text,
        to: addressesTo,
        id,
        attachments,
        isResponsed: false,
        type,
    };
};

export type MessageInfoT = ReturnType<typeof parseMessage>;
