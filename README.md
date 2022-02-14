## Getting Started

> ReportScheduler is a minimalist JavaScript library that uses daily, weekly and monthly RRules to derive a schedule used to determine future report dates without the use of time.

### Installation

```console
npm install reportscheduler --save
```

### Examples

It's easy to use ReportScheduler to create daily, weekly and monthly report schedules.

```javascript
import { ReportScheduler } from ReportScheduler;

// create daily report schedule
let reportScheduler = new ReportScheduler({
    frequency: 'DAILY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)) //time is stripped if provided
});

// create weekly report schedule
let reportScheduler = new ReportScheduler({
    frequency: 'WEEKLY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)), //time is stripped if provided
    byWeekDay: [0, 3, 4] // 0=Sunday, 6=Saturday
});

// create monthly report schedule
let reportScheduler = new ReportScheduler({
    frequency: 'MONTHLY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)), //time is stripped if provided
    byMonthDay: 20 // >28 will be set to 28
});

// create report schedule from RRule
let reportScheduler = new ReportScheduler()
reportScheduler.fromRRule('DTSTART:2049-01-01T00:00:00.000Z\nRRULE:FREQ=DAILY;INTERVAL=666');

// output report schedule to RRule
let reportScheduler = new ReportScheduler({
    frequency: 'DAILY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)) //time is stripped if provided
});
reportScheduler.toRRule();

// get next report date based on given date
let reportScheduler = new ReportScheduler({
    frequency: 'DAILY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)) //time is stripped if provided
});
reportScheduler.nextReportDate('2000-01-01');

// see if a date is a report day
let reportScheduler = new ReportScheduler({
    frequency: 'DAILY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)) //time is stripped if provided
});
reportScheduler.isReportingDay('2000-01-01');

// output report schedule in human readible text
// supports en and fr
let reportScheduler = new ReportScheduler({
    frequency: 'DAILY'
    interval: 1,
    startDate: new Date(Date.UTC(2000,0,1)) //time is stripped if provided
});
reportScheduler.toText();
reportScheduler.toText("fr");

```