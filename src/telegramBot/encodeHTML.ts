export const encodeHTML = (html: string) => {
    const res = html.replaceAll('>', '&gt;').replaceAll('<', '&lt;');
    console.log(res);

    return res;
};
