# Manipulating Dates and Times

The date and time classes are immutable, just like String was.
This means that we need to remember to assign the results of these methods to a reference variable so they are not lost.

```Java
12: LocalDate date = LocalDate.of(2014, Month.JANUARY, 20);
13: System.out.println(date); // 2014-01-20
14: date = date.plusDays(2);
15: System.out.println(date); // 2014-01-22
16: date = date.plusWeeks(1);
17: System.out.println(date); // 2014-01-29
18: date = date.plusMonths(1);
19: System.out.println(date); // 2014-02-28
20: date = date.plusYears(5);
21: System.out.println(date); // 2019-02-28
```

```Java
22: LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
23: LocalTime time = LocalTime.of(5, 15);
24: LocalDateTime dateTime = LocalDateTime.of(date, time);
25: System.out.println(dateTime); // 2020-01-20T05:15
26: dateTime = dateTime.minusDays(1);
27: System.out.println(dateTime); // 2020-01-19T05:15
28: dateTime = dateTime.minusHours(10);
29: System.out.println(dateTime); // 2020-01-18T19:15
30: dateTime = dateTime.minusSeconds(30);
31: System.out.println(dateTime); // 2020-01-18T19:14:30
```

There are two ways the exam creators can try to trick you. What do you think this prints?

```Java
LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
date.plusDays(10);
System.out.println(date);
```

It prints January 20, 2020. Adding 10 days was useless because we ignored the result. Whenever you see immutable types, pay attention to make sure the return value of a method call isn’t ignored. The exam also may test to see if you remember what each of the date and time objects includes. Do you see what is wrong here?

```Java
LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
date = date.plusMinutes(1); // DOES NOT COMPILE
```

LocalDate does not contain time. This means you cannot add minutes to it. This can be tricky in a chained sequence of additions/subtraction operations, so make sure you know which methods in Table 3.4 can be called on which of the three objects.

![alt text](resources/dates.png "Arrays")

## Periods of dates

There are five ways to create a Period class:

```Java
Period annually = Period.ofYears(1); // every 1 year
Period quarterly = Period.ofMonths(3); // every 3 months
Period everyThreeWeeks = Period.ofWeeks(3); // every 3 weeks
Period everyOtherDay = Period.ofDays(2); // every 2 days
Period everyYearAndAWeek = Period.of(1, 0, 7); // every year and 7 days
```

There’s one catch. You cannot chain methods when creating a Period. The following code looks like it is equivalent to the everyYearAndAWeek example, but it’s not. Only the last method is used because the Period.ofXXX methods are static methods.

```Java
Period wrong = Period.ofYears(1).ofWeeks(1); // every week
```

This tricky code is really like writing the following:

```Java
Period wrong = Period.ofYears(1);
wrong = Period.ofWeeks(7);

```

This is clearly not what you intended! That’s why the of() method allows us to pass in the number of years, months, and days. They are all included in the same period. You will get a compiler warning about this.

### Exemple

The zookeeper has decided to switch toys for three months.

```Java
public static void main(String[] args) {
    LocalDate start = LocalDate.of(2015, Month.JANUARY, 1);
    LocalDate end = LocalDate.of(2015, Month.MARCH, 30);
    performAnimalEnrichment(start, end);
}
private static void performAnimalEnrichment(LocalDate start, LocalDate end) {
    LocalDate upTo = start;
    while (upTo.isBefore(end)) { // check if still before end
        System.out.println("give new toy: " + upTo);
        upTo = upTo.plusMonths(1); // add a month
    }
}
```

This code works fine. It adds a month to the date until it hits the end date. The problem is that this method can’t be reused. Our zookeeper wants to try different schedules to see which works best.

```Java
public static void main(String[] args) {
    LocalDate start = LocalDate.of(2015, Month.JANUARY, 1);
    LocalDate end = LocalDate.of(2015, Month.MARCH, 30);
    Period period = Period.ofMonths(1); // create a period
    performAnimalEnrichment(start, end, period);
}
private static void performAnimalEnrichment(LocalDate start, LocalDate end, Period period) { // uses the generic period
    LocalDate upTo = start;
    while (upTo.isBefore(end)) {
    System.out.println("give new toy: " + upTo);
    upTo = upTo.plus(period); // adds the period
    }
}
```

## Periods of time

You’ve probably noticed by now that a Period is a day or more of time. There is also Duration, which is intended for smaller units of time. For Duration, you can specify the number of days, hours, minutes, seconds, or nanoseconds.

```Java

3: LocalDate date = LocalDate.of(2015, 1, 20);
4: LocalTime time = LocalTime.of(6, 15);
5: LocalDateTime dateTime = LocalDateTime.of(date, time);
6: Period period = Period.ofMonths(1);
7: System.out.println(date.plus(period)); // 2015-02-20
8: System.out.println(dateTime.plus(period)); // 2015-02-20T06:15
9: System.out.println(time.plus(period)); // UnsupportedTemporalTypeException
```

- Lines 7 and 8 work as expected. They add a month to January 20, 2015, giving us February 20, 2015. The frst has only the date, and the second has both the date and time.
- Line 9 attempts to add a month to an object that only has a time. This won’t work. Java throws an exception and complains that we attempt to use an Unsupported unit: Months.