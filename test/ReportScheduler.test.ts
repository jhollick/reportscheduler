import { ReportScheduler } from '../src/ReportScheduler';

describe("ReportScheduler toRRule function", () => {
  
  test("if default rrule", () => {
    let scheduler = new ReportScheduler();
    expect(scheduler.toRRule()).toBe(`DTSTART:${new Date().toISOString().split('T')[0]}T00:00:00.000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1`);
  });
  
  test("if using daily frequency", () => {
    let scheduler = new ReportScheduler({frequency: 'DAILY', interval: 12, startDate: new Date(Date.UTC(2049, 0, 29))});
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-29T00:00:00.000Z\nRRULE:FREQ=DAILY;INTERVAL=12`);
  });

  test("if using weekly frequency", () => {
    let scheduler = new ReportScheduler({frequency: 'WEEKLY', interval: 22, startDate: new Date(Date.UTC(2049, 0, 29)), byWeekDay: [1,4,6]});
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-29T00:00:00.000Z\nRRULE:FREQ=WEEKLY;INTERVAL=22;BYDAY=MO,TH,SA`);
  });

  test("if using monthly frequency with by month day set to 10", () => {
    let scheduler = new ReportScheduler({frequency: 'MONTHLY', interval: 32, startDate: new Date(Date.UTC(2049, 0, 29)), byMonthDay: 10});
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-29T00:00:00.000Z\nRRULE:FREQ=MONTHLY;INTERVAL=32;BYMONTHDAY=10`);
  });

  test("if using monthly frequency with by month day set to 31", () => {
    let scheduler = new ReportScheduler({frequency: 'MONTHLY', interval: 42, startDate: new Date(Date.UTC(2049, 0, 29)), byMonthDay: 31});
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-29T00:00:00.000Z\nRRULE:FREQ=MONTHLY;INTERVAL=42;BYMONTHDAY=28`);
  });

});

describe("ReportScheduler fromRRule function", () => {
  
  test("if rrule is daily", () => {
    let scheduler = new ReportScheduler();
    scheduler.fromRRule(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=DAILY;INTERVAL=666`)
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=DAILY;INTERVAL=666`);
  });

  test("if rrule is weekly", () => {
    let scheduler = new ReportScheduler();
    scheduler.fromRRule(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=WEEKLY;INTERVAL=666;BYDAY=MO,TH,SA`)
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=WEEKLY;INTERVAL=666;BYDAY=MO,TH,SA`);
  });

  test("if rrule is monthly", () => {
    let scheduler = new ReportScheduler();
    scheduler.fromRRule(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=MONTHLY;INTERVAL=666;BYMONTHDAY=20`)
    expect(scheduler.toRRule()).toBe(`DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=MONTHLY;INTERVAL=666;BYMONTHDAY=20`);
  });

});

describe("ReportScheduler nextReportDate function", () => {
  
  test("if on start date, report date should be one day after start date", () => {
    let currentDate = "2000-01-01";
    let scheduler = new ReportScheduler({
      frequency: "DAILY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1))
    });
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-02");
  });

  test("if on start date, report date should be monday after start date", () => {
    let currentDate = "2000-01-01";
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [1]
    });
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-03");
  });

  test("if on start date and by month day after start date, report date should be on 'by month day' same month as start date", () => {
    let currentDate = "2000-01-01";
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 15
    });
    let reportDate = scheduler.nextReportDate(currentDate);
    expect(reportDate).toBe("2000-01-15");
  });

});

describe("ReportScheduler isReportDay function", () => {
  
  test("if current date matches daily rrule", () => {
    let currentDate = "2010-01-01";
    let scheduler = new ReportScheduler({
      frequency: "DAILY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1))
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(true);
  });

  test("if current date does not match daily rrule", () => {
    let currentDate = "2000-01-02";
    let scheduler = new ReportScheduler({
      frequency: "DAILY",
      interval: 2, 
      startDate: new Date(Date.UTC(2000,0,1))
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(false);
  });

  test("if current date does not match weekly rrule", () => {
    let currentDate = "2000-01-01";
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [1]
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(false);
  });

  test("if current date matches weekly rrule", () => {
    let currentDate = "2000-01-03";
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [1]
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(true);
  });

  test("if current date does not match monthly rrule", () => {
    let currentDate = "2000-01-01";
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 15
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(false);
  });

  test("if current date matches monthly rrule", () => {
    let currentDate = "2000-01-15";
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 15
    });
    let isReportDay = scheduler.isReportingDay(currentDate);
    expect(isReportDay).toBe(true);
  });

});

describe("ReportScheduler toText function", () => {
  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "DAILY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1))
    });
    expect(scheduler.toText()).toBe("Every day");
    expect(scheduler.toText("fr")).toBe("Tous les jour");
  });

  test("if interval is 666 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "DAILY",
      interval: 666, 
      startDate: new Date(Date.UTC(2000,0,1))
    });
    expect(scheduler.toText()).toBe("Every 666 days");
    expect(scheduler.toText("fr")).toBe("Tous les 666 jour");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [1]
    });
    expect(scheduler.toText()).toBe("Every week on Monday");
    expect(scheduler.toText("fr")).toBe("Toutes les semaines le Lundi");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [4, 6]
    });
    expect(scheduler.toText()).toBe("Every week on Thursday and Saturday");
    expect(scheduler.toText("fr")).toBe("Toutes les semaines les Jeudi et Samedi");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "WEEKLY",
      interval: 5, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byWeekDay: [0,4,6]
    });
    expect(scheduler.toText()).toBe("Every 5 weeks on Sunday, Thursday and Saturday");
    expect(scheduler.toText("fr")).toBe("Toutes les 5 semaines les Dimanche, Jeudi et Samedi");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 1
    });
    expect(scheduler.toText()).toBe("Every month on the 1st");
    expect(scheduler.toText("fr")).toBe("Le 1er jour chaque mois");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 2
    });
    expect(scheduler.toText()).toBe("Every month on the 2nd");
    expect(scheduler.toText("fr")).toBe("Le 2e jour chaque mois");
  });

  test("if interval is 1 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 1, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 3
    });
    expect(scheduler.toText()).toBe("Every month on the 3rd");
    expect(scheduler.toText("fr")).toBe("Le 3e jour chaque mois");
  });

  test("if interval is 2 display correct text description", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 2, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 4
    });
    expect(scheduler.toText()).toBe("Every 2 months on the 4th");
    expect(scheduler.toText("fr")).toBe("Le 4e jour chaque 2 mois");
  });

  test("if using en-CA and fr-CA locale", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 2, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 4
    });
    expect(scheduler.toText("en-CA")).toBe("Every 2 months on the 4th");
    expect(scheduler.toText("fr-CA")).toBe("Le 4e jour chaque 2 mois");
  });

  test("if using en-US fr-Fr locale", () => {
    let scheduler = new ReportScheduler({
      frequency: "MONTHLY",
      interval: 2, 
      startDate: new Date(Date.UTC(2000,0,1)),
      byMonthDay: 4
    });
    expect(scheduler.toText("en-US")).toBe("Every 2 months on the 4th");
    expect(scheduler.toText("fr-FR")).toBe("Le 4e jour chaque 2 mois");
  });

});