interface ReportSchedulerOptions {
    frequency: string;
    interval: number;
    startDate: Date;
    byWeekDay?: Array<number>;
    byMonthDay?: number;
}
export declare class ReportScheduler {
    private frequency;
    private interval;
    private byMonthDay;
    private byWeekDay;
    private startDate;
    private frequencyScheduler;
    constructor(options?: ReportSchedulerOptions);
    private stripDateTime;
    private convertFromRRuleWeekdays;
    private convertToRRuleWeekdays;
    private setFrequencyScheduler;
    fromRRule(rrule: String): void;
    toRRule(): string;
    nextReportDate(currentISODate: string, inclusive?: boolean): string;
    isReportingDay(currentISODate: string): boolean;
    toText(language?: string): string;
}
export {};
