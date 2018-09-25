import format from 'date-fns/format';

const ONE_HOUR = 1000 * 60 * 60;
export const prettyPrintTimeStamp = (ms) => format(ms, `${ms > ONE_HOUR ? 'hh:' : ''}mm:ss.SS`)

export const calculateLength = (start, end) => {
    if (start == null || end == null) return '???'
    const length = (end - start) / 1000;
    return Math.round((length) * 10).toFixed(1) / 10;
};
