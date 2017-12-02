$(document).ready(function () {});

var calendar = function () {
    // 返回指定月份的天数
    this.getDaysOfMonth = function (year, month) {
        return new Date(year, month, 0).getDate();
    };

    // 返回指定月份的第一天是一周中的第几天
    this.getFirstWeekDayOfMonth = function (year, month) {
        return new Date(year, month, 0).getDay();
    };
};
