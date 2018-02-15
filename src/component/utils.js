import moment from 'moment/moment';

// eslint-disable-next-line import/prefer-default-export
export const prettyPrintTimeStamp = (ms) => {
    const tempTime = moment.duration(Math.round(ms));
    if (tempTime.hours() > 0) {
        return moment(ms).format('hh:mm:ss.SS');
    }
    return moment(ms).format('mm:ss.SS');
};
