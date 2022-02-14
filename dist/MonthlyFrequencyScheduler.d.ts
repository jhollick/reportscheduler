import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";
export declare class MonthlyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;
    byMonthDay: number;
    constructor(interval: number, startDate: string, byMonthDay: number);
    calculateFirstReportDate(): dayjs.Dayjs;
    nextReportDate(currentISODate: string, inclusive?: boolean): string;
    isReportingDay(currentISODate: string): boolean;
    private ordinal;
    toText(language?: string): string;
}
