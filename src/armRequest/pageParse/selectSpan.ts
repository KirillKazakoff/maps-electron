export function checkLiNoValue() {
    const lis = document.querySelectorAll('li');

    if (!lis) return false;

    const res = Array.from(lis).find((li) => {
        const liEl = li as HTMLLIElement;
        return liEl.textContent?.includes('Отсутствует значение параметра');
    });

    if (!res) return false;

    return res.textContent;
}

export function selectSpanReport() {
    const spans = document.querySelectorAll('span');

    if (!spans) return false;

    return Array.from(spans).find((span) => {
        const spanEl = span as HTMLSpanElement;
        return spanEl.textContent?.includes('Дата создания отчета');
    });
}
