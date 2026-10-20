// Publication dates on this personal blog use China Standard Time, regardless
// of the server timezone. ISO timestamps remain unchanged in storage/metadata.
export function articleDate(value: Date | string) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(value));
}
