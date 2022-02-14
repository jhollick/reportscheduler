import { DailyFrequencyScheduler } from '../src/DailyFrequencyScheduler';

describe("DailyFrequencyScheduler nextReportDate function", () => {
  
  //basic tests
  test("if on start date and inclusive is true, report date should be same day start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new DailyFrequencyScheduler(1, startDate);
    let reportDate = scheduler.nextReportDate(currentDate, true);
    expect(reportDate).toBe("2000-01-01");
  });

  test("if on start date, report date should be one day after start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new DailyFrequencyScheduler(1, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-02");
  });

  test("if current date after start date, report date should be one day after current date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2010-01-01";
    let scheduler = new DailyFrequencyScheduler(1, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2010-01-02");
  });

  test("if start date after current date, report date should be same day as start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "1990-01-01";
    let scheduler = new DailyFrequencyScheduler(1, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-01");
  });

  //interval tests

  test("if on start date and interval is 13, report date should be 13 days after start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new DailyFrequencyScheduler(13, startDate);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-14");
  });

});

describe("DailyFrequencyScheduler toText function", () => {
  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new DailyFrequencyScheduler(1, startDate);
    expect(scheduler.toText()).toBe("Every day");
    expect(scheduler.toText("fr")).toBe("Tous les jour");
  });

  test("if interval is 666 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new DailyFrequencyScheduler(666, startDate);
    expect(scheduler.toText()).toBe("Every 666 days");
    expect(scheduler.toText("fr")).toBe("Tous les 666 jour");
  });
});