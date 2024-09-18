export function checkPageStatusLoadingCerber() {
    const h1 = document.querySelector('h1');

    if (!h1) return false;
    return h1.textContent;
}

export function getCerberStatus(id: string) {
    function parseDate(status: string) {
        const regExp = /внесён: \d{2}.\d{2}.\d{4}/gm;
        const dateStr = status.match(regExp)[0].slice(8, 100).trim();

        const dateParser = /(\d{2}).(\d{2}).(\d{4})/m;
        const match = dateStr.match(dateParser);

        const newDate = match[3] + '.' + match[2] + '.' + match[1];

        if (!newDate) {
            console.log(status);
            return;
        }

        return new Date(newDate);
    }

    const initInfoObj = () => ({ date: new Date('2001.01.01'), status: '-' });

    type InfoObjT = ReturnType<typeof initInfoObj>;

    const info = {
        countries: <{ [key: string]: InfoObjT }>{
            'Китай': initInfoObj(),
            'Япония': initInfoObj(),
            'Корея, Республика': initInfoObj(),
        },
        company: '',
        id,
    };
    const exceptCountries = ['Тайвань'];
    const trList = Array.from(document.querySelectorAll('table')[0].children[1].children);

    trList.forEach((tr, i) => {
        const tdList = tr.children;

        let itemDesc = '';

        if (i === 0) {
            itemDesc = tdList[2].textContent;
            info.company = tdList[1].textContent;
        } else {
            itemDesc = tdList[0].textContent;
        }

        let statuses: Element[];
        if (i === 0) {
            statuses = Array.from(tdList[3].children);
        } else {
            statuses = Array.from(tdList[1].children);
        }

        if (!itemDesc.includes('ракообразные, в панцире или без панциря, живые')) return;

        // accumulate countriy statuses in object
        Object.keys(info.countries).forEach((key) => {
            statuses.forEach((item) => {
                const status = item.firstElementChild.textContent;

                const isExeption = exceptCountries.some((e) => status.includes(e));
                if (isExeption) return;

                const isInList = status.includes(key);
                if (isInList) {
                    const infoObj = info.countries[key];
                    const newDate = parseDate(status);

                    const statusParsed = status.toLowerCase().includes('без ограничений')
                        ? '+'
                        : '-';

                    if (infoObj.date < newDate) {
                        infoObj.date = newDate;
                        infoObj.status = statusParsed;
                    }
                }
            });
        });
    });

    const result = Object.keys(info.countries).reduce<string[][]>((total, key) => {
        const country = info.countries[key];
        const date =
            country.date.getFullYear() === 2001
                ? ''
                : country.date.toLocaleString('ru', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                  });

        total.push([info.id, info.countries[key].status, date, key]);
        return total;
    }, []);

    return result[0];
}
