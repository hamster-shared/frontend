
const sd = require("silly-datetime");
/**
 * 将毫秒转换成YYYY-MM-DD格式
 * @param time
 * @returns {string}
 */
export const timeToDay = time => {
    return sd.format(new Date(time), "YYYY-MM-DD:HH:mm");
};
