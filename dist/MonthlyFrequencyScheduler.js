"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyFrequencyScheduler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
class MonthlyFrequencyScheduler {
    constructor(interval, startDate, byMonthDay) {
        this.interval = interval;
        this.startDate = startDate;
        this.byMonthDay = byMonthDay;
    }
    calculateFirstReportDate() {
        let startDate = (0, dayjs_1.default)(this.startDate);
        let startDateDayOfMonth = startDate.date();
        let firstReportDate = (0, dayjs_1.default)(this.startDate);
        firstReportDate = firstReportDate.date(this.byMonthDay);
        if (startDateDayOfMonth > this.byMonthDay) {
            firstReportDate = firstReportDate.add(this.interval, 'month');
        }
        return firstReportDate;
    }
    nextReportDate(currentISODate, inclusive = false) {
        let currentDate = (inclusive) ? (0, dayjs_1.default)(currentISODate) : (0, dayjs_1.default)(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();
        while (nextReportDate.isBefore(currentDate)) {
            nextReportDate = nextReportDate.add(this.interval, 'month');
        }
        return nextReportDate.format('YYYY-MM-DD');
    }
    isReportingDay(currentISODate) {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }
    ordinal(language) {
        if (language == 'en') {
            if (this.byMonthDay > 3 && this.byMonthDay < 21)
                return `${this.byMonthDay}th`;
            switch (this.byMonthDay % 10) {
                case 1: return `${this.byMonthDay}st`;
                case 2: return `${this.byMonthDay}nd`;
                case 3: return `${this.byMonthDay}rd`;
                default: return `${this.byMonthDay}th`;
            }
        }
        else {
            return (this.byMonthDay == 1) ? `${this.byMonthDay}er` : `${this.byMonthDay}e`;
        }
    }
    toText(language = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}month${(this.interval > 1) ? 's' : ''} on the ${this.ordinal(language)}`;
        }
        else {
            return `Le ${this.ordinal(language)} jour chaque${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}mois`;
        }
    }
}
exports.MonthlyFrequencyScheduler = MonthlyFrequencyScheduler;
