
const sd = require("silly-datetime");
/**
 * Convert milliseconds to YYYY-MM-DD format
 * @param time
 * @returns {string}
 */
export const timeToDay = time => {
    return sd.format(new Date(time), "YYYY-MM-DD:HH:mm");
};
