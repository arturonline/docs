# Working with Dates and Times

```java
import java.time.*; // import time classes
```

When working with dates and times, the first thing to do is decide how much information you need. The exam gives you three choices:

- **LocalDate** Contains just a date—no time and no time zone. A good example of LocalDate is your birthday this year.
- **LocalTime** Contains just a time—no date and no time zone. A good example of LocalTime is midnight. It is midnight at the same time every day.
- **LocalDateTime** Contains both a date and time but no time zone. A good example of LocalDateTime is “the stroke of midnight on New Year’s.” Midnight on January 2 isn’t nearly as special, and clearly an hour after midnight isn’t as special either.

Ex:

```Java
System.out.println(LocalDate.now());
System.out.println(LocalTime.now());
System.out.println(LocalDateTime.now());
```

Each of the three classes has a static method called **now()** that gives the current date and
time. Your output is going to depend on what date/time you run it and where you live. The
authors live in the United States, making the output look like the following when run on
January 20 at 12:45 p.m.:

```Java

2015-01-20  // date and no time.
12:45:18.401  // time and no date
2015-01-20T12:45:18.401  // date and time
```

Java uses **T** to separate the date and time when converting LocalDateTime to a String

## Creating dates and times

```Java
public static LocalDate of(int year, int month, int dayOfMonth)
public static LocalDate of(int year, Month month, int dayOfMonth)

public static LocalTime of(int hour, int minute)
public static LocalTime of(int hour, int minute, int second)
public static LocalTime of(int hour, int minute, int second, int nanos)
```

For months, Java counts starting from 1.

```Java
LocalDate date1 = LocalDate.of(2015, Month.JANUARY, 20);
LocalDate date2 = LocalDate.of(2015, 1, 20);

LocalTime time1 = LocalTime.of(6, 15); // hour and minute
LocalTime time2 = LocalTime.of(6, 15, 30); // + seconds
LocalTime time3 = LocalTime.of(6, 15, 30, 200); // + nanoseconds
```

We can combine dates and times:

```Java

LocalDateTime dateTime1 = LocalDateTime.of(2015, Month.JANUARY, 20, 6, 15, 30);
LocalDateTime dateTime2 = LocalDateTime.of(date1, time1);
```

```Java
LocalDate d = new LocalDate(); // DOES NOT COMPILE
```

Don’t fall for this. You are not allowed to construct a date or time object directly.

Another trick is to see what happens when you pass invalid numbers to of(). For example:

```Java
LocalDate.of(2015, Month.JANUARY, 32) // throws DateTimeException
```