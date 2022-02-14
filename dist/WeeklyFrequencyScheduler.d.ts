import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";
export declare class WeeklyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;
    byWeekDay: Array<number>;
    constructor(interval: number, startDate: string, byWeekDay: Array<number>);
    calculateFirstReportDate(): dayjs.Dayjs;
    nextReportDate(currentISODate: string, inclusive?: boolean): string;
    isReportingDay(currentISODate: string): boolean;
    private arrayToSentence;
    private weekDays;
    toText(language?: string): string;
}
