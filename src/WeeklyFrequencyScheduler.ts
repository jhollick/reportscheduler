import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";

export class WeeklyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;
    byWeekDay: Array<number>;

    constructor(interval: number, startDate: string, byWeekDay: Array<number> | undefined = undefined) {
        this.interval = interval;
        this.startDate = startDate;
        this.byWeekDay = byWeekDay ?? [new Date(startDate).getUTCDay()];
        this.byWeekDay.sort((a, b) => {
            return a - b;
        });
    }

    calculateFirstReportDate(): dayjs.Dayjs {
        let startDate = dayjs(this.startDate);
        let startDateDayOfWeek = startDate.day();

        let eligibleWeekdays = this.byWeekDay.filter(day => day >= startDateDayOfWeek);
        
        return (eligibleWeekdays.length) 
            ? startDate.day(Math.min(...eligibleWeekdays)) : startDate.add(this.interval, 'week').day(Math.min(...this.byWeekDay));
    }

    nextReportDate(currentISODate: string, inclusive: boolean = false): string {
        let currentDate = (inclusive) ? dayjs(currentISODate) : dayjs(currentISODate).add(1, 'day');
        let nextReportDate = this.calculateFirstReportDate();

        while(nextReportDate.isBefore(currentDate)) {
            let nextDayOfWeek = this.byWeekDay.find(weekDay => weekDay > nextReportDate.day());
            if(nextDayOfWeek) {
               nextReportDate = nextReportDate.day(nextDayOfWeek);
            } else {
               nextReportDate = nextReportDate.add(this.interval, 'week').day(this.byWeekDay[0]);;
            }
        }
        return nextReportDate.format('YYYY-MM-DD');
    }

    isReportingDay(currentISODate: string): boolean {
        let nextReportDate = this.nextReportDate(currentISODate, true);
        return nextReportDate == currentISODate;
    }

    private arrayToSentence(array: Array<string>, language: string) {
        if(array.length == 1) {
            return array[0];
        }

        let last = array.pop();
        return array.join(', ') + ((language == 'en') ? ' and ' : ' et ') + last;
    }

    private weekDays(language: string) {
        let results = [];
        let weekDays : { [key: string]: any } = {
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
        }
        for(let weekday of this.byWeekDay) {
            results.push(weekDays[language][weekday])
        }

        return this.arrayToSentence(results, language);
    }

    toText(language: string = 'en') {
        if (language == 'en') {
            return `Every${(this.interval > 1) ? ' '+this.interval+' ' : ' '}week${(this.interval > 1) ? 's' : ''} on ${this.weekDays(language)}`;
        } else {
            return `Toutes les${(this.interval > 1) ? ' '+this.interval+' ' : ' '}semaines le${(this.byWeekDay.length > 1) ? 's' : ''} ${this.weekDays(language)}`;
        }
    }
}