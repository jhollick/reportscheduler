import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";

export class DailyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;

    constructor(interval: number, startDate: string) {
        this.interval = interval;
        this.startDate = startDate;
    }

    calculateFirstReportDate(): dayjs.Dayjs {
        let firstReportDate = dayjs(this.startDate);
        return firstReportDate;
    }

    nextReportDate(currentISODate: string, inclusive: boolean = false): string {
        let currentDate = (inclusive) ? dayjs(currentISODate) : dayjs(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();

        while(nextReportDate.isBefore(currentDate)) {
            nextReportDate = nextReportDate.add(this.interval, 'day');
        }
        return nextReportDate.format('YYYY-MM-DD');
    }

    isReportingDay(currentISODate: string): boolean {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }
    
    toText(language: string = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' '+this.interval+' ' : ' '}day${(this.interval > 1) ? 's' : ''}`;
        } else {
            return `Tous les${(this.interval > 1) ? ' '+this.interval+' ' : ' '}jour`;
        }
    }
}