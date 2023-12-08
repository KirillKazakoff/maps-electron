export function selectSpan() {
    const spans = document.querySelectorAll('span');

    if (!spans) return;
    return Array.from(spans).find((span) => {
        const spanEl = span as HTMLSpanElement;
        return spanEl.textContent?.includes('Дата создания отчета');
    });
}
