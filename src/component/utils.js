import moment from 'moment/moment';

export const prettyPrintTimeStamp = (ms) => {
    const tempTime = moment.duration(Math.round(ms));
    if (tempTime.hours() > 0) {
        return moment(ms).format('hh:mm:ss.SS');
    }
    return moment(ms).format('mm:ss.SS');
};

export const calculateLength = (start, end) => {
    const length = (end - start) / 1000;
    return Math.round((length) * 10).toFixed(1) / 10;
};
