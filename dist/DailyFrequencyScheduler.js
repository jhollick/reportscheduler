"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyFrequencyScheduler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
class DailyFrequencyScheduler {
    constructor(interval, startDate) {
        this.interval = interval;
        this.startDate = startDate;
    }
    calculateFirstReportDate() {
        let firstReportDate = (0, dayjs_1.default)(this.startDate);
        return firstReportDate;
    }
    nextReportDate(currentISODate, inclusive = false) {
        let currentDate = (inclusive) ? (0, dayjs_1.default)(currentISODate) : (0, dayjs_1.default)(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();
        while (nextReportDate.isBefore(currentDate)) {
            nextReportDate = nextReportDate.add(this.interval, 'day');
        }
        return nextReportDate.format('YYYY-MM-DD');
    }
    isReportingDay(currentISODate) {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }
    toText(language = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}day${(this.interval > 1) ? 's' : ''}`;
        }
        else {
            return `Tous les${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}jour`;
        }
    }
}
exports.DailyFrequencyScheduler = DailyFrequencyScheduler;
