import { MonthlyFrequencyScheduler } from '../src/MonthlyFrequencyScheduler';

describe("MonthlyFrequencyScheduler nextReportDate function", () => {
  
  //basic tests

  test("if on start date and by month day after start date, report date should be on 'by month day' same month as start date", () => {
    let startDate = "2000-01-01";
    let currentDate = "2000-01-01";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 15);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-15");
  });

  test("if on start date and start date more then by month day, report date should be on 'by month day' 1 month from start date", () => {
    let startDate = "2000-01-16";
    let currentDate = "2000-01-16";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 15);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-02-15");
  });

  test("if start date after current date, report date should be on 'by month day' after start date", () => {
    let startDate = "2000-01-16";
    let currentDate = "2000-01-15";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 15);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-02-15");
  });

  test("if current date after start date, report date should be on 'by month day' after current date", () => {
    let startDate = "2000-01-15";
    let currentDate = "2010-01-15";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 15);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2010-02-15");
  });

  //interval & by month day tests

  test("if on start date and by month day before start date and interval 6, report date should be on 'by month day' 6 months from start date", () => {
    let startDate = "2000-01-15";
    let currentDate = "2000-01-15";
    let scheduler = new MonthlyFrequencyScheduler(6, startDate, 14);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-07-14");
  });

  test("if on start date and by month day after start date and interval 6, report date should on 'by month day' same month as start date", () => {
    let startDate = "2000-01-15";
    let currentDate = "2000-01-15";
    let scheduler = new MonthlyFrequencyScheduler(6, startDate, 16);
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-16");
  });

});

describe("MonthlyFrequencyScheduler toText function", () => {
  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 1);
    expect(scheduler.toText()).toBe("Every month on the 1st");
    expect(scheduler.toText("fr")).toBe("Le 1er jour chaque mois");
  });

  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 2);
    expect(scheduler.toText()).toBe("Every month on the 2nd");
    expect(scheduler.toText("fr")).toBe("Le 2e jour chaque mois");
  });

  test("if interval is 1 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new MonthlyFrequencyScheduler(1, startDate, 3);
    expect(scheduler.toText()).toBe("Every month on the 3rd");
    expect(scheduler.toText("fr")).toBe("Le 3e jour chaque mois");
  });

  test("if interval is 2 display correct text description", () => {
    let startDate = "2000-01-01";
    let scheduler = new MonthlyFrequencyScheduler(2, startDate, 4);
    expect(scheduler.toText()).toBe("Every 2 months on the 4th");
    expect(scheduler.toText("fr")).toBe("Le 4e jour chaque 2 mois");
  });
});