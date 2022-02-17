import { DailyFrequencyScheduler } from "./DailyFrequencyScheduler";
import { WeeklyFrequencyScheduler } from "./WeeklyFrequencyScheduler";
import { MonthlyFrequencyScheduler } from "./MonthlyFrequencyScheduler";
import { IFrequencyScheduler } from "./IFrequencyScheduler";

interface ReportSchedulerOptions {
    frequency: string; 
    interval: number; 
    startDate: Date; 
    byWeekDay?: Array<number>; 
    byMonthDay?: number; 
}

export class ReportScheduler {
    private frequency: string;
    private interval: number;
    private byMonthDay: number | undefined;
    private byWeekDay: Array<number> | undefined;
    private startDate: string;
    private frequencyScheduler: IFrequencyScheduler;

    constructor(options: ReportSchedulerOptions = { frequency: 'MONTHLY', interval: 1, startDate: new Date() }) {
        this.frequency = options.frequency;
        this.interval = options.interval;
        this.startDate = this.stripDateTime(options.startDate);
        this.byWeekDay = options.byWeekDay;
        this.byMonthDay = options.byMonthDay ? Math.min(options.byMonthDay, 28) : undefined;
        this.setFrequencyScheduler();
    }

    private stripDateTime(date: Date) {
        return date.toISOString().split('T')[0];
    }

    private convertFromRRuleWeekdays(weekday: string) {
        let weekdays : { [key: string]: any } = {
            'SU': 0,
            'MO': 1,
            'TU': 2,
            'WE': 3,
            'TH': 4,
            'FR': 5,
            'SA': 6
        }
        return weekdays[weekday];
    }

    private convertToRRuleWeekdays(weekday: number) {
        let weekdays : { [key: string]: any } = {
            0: 'SU',
            1: 'MO',
            2: 'TU',
            3: 'WE',
            4: 'TH',
            5: 'FR',
            6: 'SA'
        }
        return weekdays[weekday];
    }

    private setFrequencyScheduler() {
        switch(this.frequency) {
            case "DAILY":
                this.frequencyScheduler = new DailyFrequencyScheduler(this.interval, this.startDate);
                break;
            case "WEEKLY":
                this.frequencyScheduler = new WeeklyFrequencyScheduler(this.interval, this.startDate, this.byWeekDay || [0]);
                break;
            case "MONTHLY":
                this.frequencyScheduler = new MonthlyFrequencyScheduler(this.interval, this.startDate, this.byMonthDay || 1);
                break;
        }
    } 

    fromRRule(rrule: String) {
        let matches: any = rrule.match(/^DTSTART\:(.*)\nRRULE\:(.*)$/);

        let rules: any = matches[2].split(';').reduce((map : { [key: string]: any } , rule: string) => {
            let [key, value] = rule.split('=');
            map[key] = value;
            return map;
        }, {});

        this.frequency = rules.FREQ;
        this.interval = rules.INTERVAL;
        this.byMonthDay = rules.BYMONTHDAY ? Math.min(rules.BYMONTHDAY, 28) : undefined;
        this.byWeekDay = rules.BYDAY ? rules.BYDAY.split(',').map((day: string) => this.convertFromRRuleWeekdays(day)) : undefined;

        this.startDate = matches[1].split('T')[0]; 
        this.setFrequencyScheduler();
    }

    toRRule() {
        let rules = [`FREQ=${this.frequency}`, `INTERVAL=${this.interval}`];
        if(this.byMonthDay) {
            rules.push(`BYMONTHDAY=${this.byMonthDay}`);
        }
        if(this.byWeekDay) {
            rules.push(`BYDAY=${this.byWeekDay.map((day: number) => this.convertToRRuleWeekdays(day))}`);
        }
        return `DTSTART:${this.startDate}T00:00:00.000Z\nRRULE:${rules.join(';')}`
    }  

    nextReportDate(currentISODate: string, inclusive: boolean = false) {
        return this.frequencyScheduler.nextReportDate(currentISODate, inclusive)
    }

    isReportingDay(currentISODate: string) {
        return this.frequencyScheduler.isReportingDay(currentISODate);
    }

    toText(language: string = 'en') {
        language = language.startsWith('fr') ? 'fr' : 'en';
        return this.frequencyScheduler.toText(language);
    }
}