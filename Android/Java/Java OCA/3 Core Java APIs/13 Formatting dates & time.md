# Formatting Dates and Times

Java provides a class called DateTimeFormatter to format any type of date and/or time object.
DateTimeFormatter is in the package java.time.format.

```Java
LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
LocalTime time = LocalTime.of(11, 12, 34);
LocalDateTime dateTime = LocalDateTime.of(date, time);
System.out.println(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
System.out.println(time.format(DateTimeFormatter.ISO_LOCAL_TIME));
System.out.println(dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

//2020-01-20
//11:12:34
//2020-01-20T11:12:34
```

This is a reasonable way for computers to communicate, but probably not how you want to output the date and time in your program. Luckily there are some predefined formats that are more useful:

```Java
DateTimeFormatter shortDateTime =
DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT);
System.out.println(shortDateTime.format(dateTime)); // 1/20/20
System.out.println(shortDateTime.format(date)); // 1/20/20
System.out.println(
shortDateTime.format(time)); // UnsupportedTemporalTypeException
```

Here we say we want a localized formatter in the predefined short format. The last line throws an exception because a time cannot be formatted as a date. The format() method is declared on both the formatter objects and the date/time objects, allowing you to reference
the objects in either order. The following statements print exactly the same thing as the previous code:

```Java
DateTimeFormatter shortDateTime =
DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT);
System.out.println(dateTime.format(shortDateTime));
System.out.println(date.format(shortDateTime));
System.out.println(time.format(shortDateTime));
```

There are two predefined formats that can show up on the exam: **SHORT** and **MEDIUM**. The other predefined formats involve time zones, which are not on the exam.

```Java
LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
LocalTime time = LocalTime.of(11, 12, 34);
LocalDateTime dateTime = LocalDateTime.of(date, time);
DateTimeFormatter shortF = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.SHORT);
DateTimeFormatter mediumF = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM);
System.out.println(shortF.format(dateTime)); // 1/20/20 11:12 AM
System.out.println(mediumF.format(dateTime)); // Jan 20, 2020 11:12:34 AM
```

## Create your own date & time formats

- **MMMM** M represents the month. The more Ms you have, the more verbose the Java output. For example, *M* outputs 1, *MM* outputs 01, *MMM* outputs Jan, and *MMMM* outputs January.
- **dd** represents the date in the month. As with month, the more ds you have, the more verbose the Java output. *dd* means to include the leading zero for a single-digit month.
- **,** Use *,* if you want to output a comma (this also appears after the year).
- **yyyy** represents the year. *yy* outputs a two-digit year and *yyyy* outputs a four-digit year.
- **hh** h represents the hour. Use hh to include the leading zero if you’re outputting a singledigit hour.
- **:** Use *:* if you want to output a colon.
- **mm** represents the minute

Exemple1:

```Java

DateTimeFormatter f = DateTimeFormatter.ofPattern("MMMM dd, yyyy, hh:mm");
System.out.println(dateTime.format(f)); // January 20, 2020, 11:12

```

Exemple2:

```Java

4: DateTimeFormatter f = DateTimeFormatter.ofPattern("hh:mm");
5: f.format(dateTime);
6: f.format(date);
7: f.format(time);

```

If you get this question on the exam, think about what the symbols represent. We have
h for hour and m for minute. Remember M (uppercase) is month and m (lowercase) is minute.
We can only use this formatter with objects containing times. Therefore, line 6 will throw
an exception.