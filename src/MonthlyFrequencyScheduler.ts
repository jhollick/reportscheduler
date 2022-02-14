import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";

export class MonthlyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;
    byMonthDay: number;

    constructor(interval: number, startDate: string, byMonthDay: number) {
        this.interval = interval;
        this.startDate = startDate;
        this.byMonthDay = byMonthDay;
    }

    calculateFirstReportDate(): dayjs.Dayjs {
        let startDate = dayjs(this.startDate);
        let startDateDayOfMonth = startDate.date();

        let firstReportDate = dayjs(this.startDate);
        firstReportDate = firstReportDate.date(this.byMonthDay);

        if (startDateDayOfMonth > this.byMonthDay) {
            firstReportDate = firstReportDate.add(this.interval, 'month');
        }
        return firstReportDate;
    }

    nextReportDate(currentISODate: string, inclusive: boolean = false): string {
        let currentDate = (inclusive) ? dayjs(currentISODate) : dayjs(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();

        while (nextReportDate.isBefore(currentDate)) {
            nextReportDate = nextReportDate.add(this.interval, 'month');
        }
        return nextReportDate.format('YYYY-MM-DD');
    }

    isReportingDay(currentISODate: string): boolean {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }

    private ordinal(language: string) {
        if (language == 'en') {
            if (this.byMonthDay > 3 && this.byMonthDay < 21) return `${this.byMonthDay}th`;
            switch (this.byMonthDay % 10) {
                case 1: return `${this.byMonthDay}st`;
                case 2: return `${this.byMonthDay}nd`;
                case 3: return `${this.byMonthDay}rd`;
                default: return `${this.byMonthDay}th`;
            }
        } else {
            return (this.byMonthDay == 1) ? `${this.byMonthDay}er` : `${this.byMonthDay}e`;
        }
    }

    toText(language: string = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' '+this.interval+' ' : ' '}month${(this.interval > 1) ? 's' : ''} on the ${this.ordinal(language)}`;
        } else {
            return `Le ${this.ordinal(language)} jour chaque${(this.interval > 1) ? ' '+this.interval+' ' : ' '}mois`;
        }
    }
}