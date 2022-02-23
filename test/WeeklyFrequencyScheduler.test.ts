import { WeeklyFrequencyScheduler } from '../src/WeeklyFrequencyScheduler';

describe("WeeklyFrequencyScheduler nextReportDate function", () => {
  
  //basic tests

  test("if on start date, report date should be monday after start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-03");
  });

  test("if current date after start date, report date should be monday after current date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2010-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2010-01-04");
  });

  test("if start date after current date, report date should be monday after start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "1990-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-03");
  });

  //intervals

  test("if on start date and interval is 4 and 'by week day' is monday and start date not monday, report date should be monday 4 weeks after start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new WeeklyFrequencyScheduler(4, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-24");
  });

  test("if on start date and interval is 4 and 'by week day' is monday and start date is monday, report date should be monday 4 weeks after start date", () => {
    let startDate = "2000-01-03";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(4, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-31");
  });

  test("if current date after start date and interval is 4, report date should be monday 4 weeks after current date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(4, startDate, [1]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-24");
  });

  test("if current date after start date and week days not defined, report date should be next day based on startDate day", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, undefined);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-08");
  });

  test("if current date after start date and week days not defined, report date should be next day based on startDate day", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-08");
  });

  test("if current date after start date and week days not defined, report date should be the third day based on startDate day", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(3, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-22");
  });

  //by week day tests

  test("if start date on monday and 'by week day' includes tuesday, report date should be tomorrow", () => {
    let startDate = "2000-01-03";
    let currentDate = "2000-01-03";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1,2,5]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-04");
  });

  test("if start date on tuesday and 'by week day' includes fridays, report date should be next friday", () => {
    let startDate = "2000-01-04";
    let currentDate = "2000-01-04";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1,2,5]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-07");
  });

  test("if start date on friday and 'by week day' includes mondays, report date should be next monday", () => {
    let startDate = "2000-01-07";
    let currentDate = "2000-01-07";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1,2,5]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-10");
  });

  test("if current date is friday and 'by week day' includes mondays, report date should be next monday", () => {
    let startDate = "2000-01-01";
    let currentDate = "2010-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1,2,5]);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2010-01-04");
  });

});

describe("WeeklyFrequencyScheduler toText function", () => {
  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [1]);
    expect(scheduler.toText()).toBe("Every week on Monday");
    expect(scheduler.toText("fr")).toBe("Toutes les semaines le Lundi");
  });

  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new WeeklyFrequencyScheduler(1, startDate, [4, 6]);
    expect(scheduler.toText()).toBe("Every week on Thursday and Saturday");
    expect(scheduler.toText("fr")).toBe("Toutes les semaines les Jeudi et Samedi");
  });

  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new WeeklyFrequencyScheduler(5, startDate, [0, 4, 6]);
    expect(scheduler.toText()).toBe("Every 5 weeks on Sunday, Thursday and Saturday");
    expect(scheduler.toText("fr")).toBe("Toutes les 5 semaines les Dimanche, Jeudi et Samedi");
  });

});