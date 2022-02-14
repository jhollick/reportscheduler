import { IFrequencyScheduler } from "./IFrequencyScheduler";
import dayjs from "dayjs";
export declare class DailyFrequencyScheduler implements IFrequencyScheduler {
    interval: number;
    startDate: string;
    constructor(interval: number, startDate: string);
    calculateFirstReportDate(): dayjs.Dayjs;
    nextReportDate(currentISODate: string, inclusive?: boolean): string;
    isReportingDay(currentISODate: string): boolean;
    toText(language?: string): string;
}
