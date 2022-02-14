"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportScheduler = void 0;
const DailyFrequencyScheduler_1 = require("./DailyFrequencyScheduler");
const WeeklyFrequencyScheduler_1 = require("./WeeklyFrequencyScheduler");
const MonthlyFrequencyScheduler_1 = require("./MonthlyFrequencyScheduler");
class ReportScheduler {
    constructor(options = { frequency: 'MONTHLY', interval: 1, startDate: new Date() }) {
        this.frequency = options.frequency;
        this.interval = options.interval;
        this.startDate = this.stripDateTime(options.startDate);
        this.byWeekDay = options.byWeekDay;
        this.byMonthDay = options.byMonthDay ? Math.min(options.byMonthDay, 28) : undefined;
        this.setFrequencyScheduler();
    }
    stripDateTime(date) {
        return date.toISOString().split('T')[0];
    }
    convertFromRRuleWeekdays(weekday) {
        let weekdays = {
            'SU': 0,
            'MO': 1,
            'TU': 2,
            'WE': 3,
            'TH': 4,
            'FR': 5,
            'SA': 6
        };
        return weekdays[weekday];
    }
    convertToRRuleWeekdays(weekday) {
        let weekdays = {
            0: 'SU',
            1: 'MO',
            2: 'TU',
            3: 'WE',
            4: 'TH',
            5: 'FR',
            6: 'SA'
        };
        return weekdays[weekday];
    }
    setFrequencyScheduler() {
        switch (this.frequency) {
            case "DAILY":
                this.frequencyScheduler = new DailyFrequencyScheduler_1.DailyFrequencyScheduler(this.interval, this.startDate);
                break;
            case "WEEKLY":
                this.frequencyScheduler = new WeeklyFrequencyScheduler_1.WeeklyFrequencyScheduler(this.interval, this.startDate, this.byWeekDay || [0]);
                break;
            case "MONTHLY":
                this.frequencyScheduler = new MonthlyFrequencyScheduler_1.MonthlyFrequencyScheduler(this.interval, this.startDate, this.byMonthDay || 1);
                break;
        }
    }
    fromRRule(rrule) {
        let matches = rrule.match(/^DTSTART\:(.*)\nRRULE\:(.*)$/);
        let rules = matches[2].split(';').reduce((map, rule) => {
            let [key, value] = rule.split('=');
            map[key] = value;
            return map;
        }, {});
        this.frequency = rules.FREQ;
        this.interval = rules.INTERVAL;
        this.byMonthDay = rules.BYMONTHDAY ? Math.min(rules.BYMONTHDAY, 28) : undefined;
        this.byWeekDay = rules.BYDAY ? rules.BYDAY.split(',').map((day) => this.convertFromRRuleWeekdays(day)) : undefined;
        this.startDate = matches[1].split('T')[0];
        this.setFrequencyScheduler();
    }
    toRRule() {
        let rules = [`FREQ=${this.frequency}`, `INTERVAL=${this.interval}`];
        if (this.byMonthDay) {
            rules.push(`BYMONTHDAY=${this.byMonthDay}`);
        }
        if (this.byWeekDay) {
            rules.push(`BYDAY=${this.byWeekDay.map((day) => this.convertToRRuleWeekdays(day))}`);
        }
        return `DTSTART:${this.startDate}T00:00:00.000Z\nRRULE:${rules.join(';')}`;
    }
    nextReportDate(currentISODate, inclusive = false) {
        return this.frequencyScheduler.nextReportDate(currentISODate, inclusive);
    }
    isReportingDay(currentISODate) {
        return this.frequencyScheduler.isReportingDay(currentISODate);
    }
    toText(language = 'en') {
        return this.frequencyScheduler.toText(language);
    }
}
exports.ReportScheduler = ReportScheduler;
