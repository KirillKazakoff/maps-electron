export function checkLiNoValue() {
    const lis = document.querySelectorAll('li');

    if (!lis) return false;

    const res = Array.from(lis).find((li) => {
        return li.textContent?.includes('Отсутствует значение параметра');
    });

    if (!res) return false;

    return res.textContent;
}

export function checkPageStatusLoading(element: 'span' | 'input') {
    function selectSpan() {
        const spans = document.querySelectorAll('span');

        if (!spans) return false;

        return Array.from(spans).find((span) => {
            return span.textContent?.includes('Дата создания отчета');
        });
    }

    function selectInput() {
        const inputs = document.querySelectorAll('input');

        if (!inputs) return false;

        return Array.from(inputs).find((input) => {
            return input.value.includes('Просмотреть отчет');
        });
    }

    if (element === 'span') {
        return selectSpan();
    } else {
        return selectInput();
    }
}
