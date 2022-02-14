"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyFrequencyScheduler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
class WeeklyFrequencyScheduler {
    constructor(interval, startDate, byWeekDay) {
        this.interval = interval;
        this.startDate = startDate;
        this.byWeekDay = byWeekDay;
        this.byWeekDay.sort((a, b) => {
            return a - b;
        });
    }
    calculateFirstReportDate() {
        let startDate = (0, dayjs_1.default)(this.startDate);
        let startDateDayOfWeek = startDate.day();
        let eligibleWeekdays = this.byWeekDay.filter(day => day >= startDateDayOfWeek);
        return (eligibleWeekdays.length)
            ? startDate.day(Math.min(...eligibleWeekdays)) : startDate.add(this.interval, 'week').day(Math.min(...this.byWeekDay));
    }
    nextReportDate(currentISODate, inclusive = false) {
        let currentDate = (inclusive) ? (0, dayjs_1.default)(currentISODate) : (0, dayjs_1.default)(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();
        while (nextReportDate.isBefore(currentDate)) {
            let nextDayOfWeek = this.byWeekDay.find(weekDay => weekDay > nextReportDate.day());
            if (nextDayOfWeek) {
                nextReportDate = nextReportDate.day(nextDayOfWeek);
            }
            else {
                nextReportDate = nextReportDate.add(this.interval, 'week').day(this.byWeekDay[0]);
                ;
            }
        }
        return nextReportDate.format('YYYY-MM-DD');
    }
    isReportingDay(currentISODate) {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }
    arrayToSentence(array, language) {
        if (array.length == 1) {
            return array[0];
        }
        let last = array.pop();
        return array.join(', ') + ((language == 'en') ? ' and ' : ' et ') + last;
    }
    weekDays(language) {
        let results = [];
        let weekDays = {
            en: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            fr: [
                'Dimanche',
                'Lundi',
                'Mardi',
                'Mercredi',
                'Jeudi',
                'Vendredi',
                'Samedi'
            ]
        };
        for (let weekday of this.byWeekDay) {
            results.push(weekDays[language][weekday]);
        }
        return this.arrayToSentence(results, language);
    }
    toText(language = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}week${(this.interval > 1) ? 's' : ''} on ${this.weekDays(language)}`;
        }
        else {
            return `Toutes les${(this.interval > 1) ? ' ' + this.interval + ' ' : ' '}semaines le${(this.byWeekDay.length > 1) ? 's' : ''} ${this.weekDays(language)}`;
        }
    }
}
exports.WeeklyFrequencyScheduler = WeeklyFrequencyScheduler;
