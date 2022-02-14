import dayjs from "dayjs";
export interface IFrequencyScheduler {
    interval: number;
    startDate: string;
    calculateFirstReportDate(inclusive: boolean): dayjs.Dayjs;
    nextReportDate(currentISODate: string, inclusive: boolean): string;
    isReportingDay(currentISODate: string): boolean;
    toText(langauage: string): string;
}
