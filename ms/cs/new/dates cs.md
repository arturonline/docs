# Working with Date and Time in C#

C# includes `DateTime` struct to work with dates and times. 

## DateTime

The `DateTime` value type represents an instant in time, typically expressed as a date and time of day. 

```c#
//assigns default value 01/01/0001 00:00:00
DateTime dt1 = new DateTime(); 

//assigns year, month, day
DateTime dt2 = new DateTime(2015, 12, 31); 

//assigns year, month, day, hour, min, seconds
DateTime dt3 = new DateTime(2015, 12, 31, 5, 10, 20);
 
//assigns year, month, day, hour, min, seconds, UTC timezone
DateTime dt4 = new DateTime(2015, 12, 31, 5, 10, 20, DateTimeKind.Utc);
```

Ex:

```c#
using System;

DateTime now = DateTime.Now;
Console.WriteLine(now.ToString("F"));

// Monday, 17 May 2021 08:22:32
```

## Timespan

TimeSpan represents a time interval (duration of time or elapsed time) that is measured as a positive or negative number of days, hours, minutes, seconds, and fractions of a second.

### Time Elapsed

In the example, we subtract two time values:

```c#
using System;

string startTime = "7:00 AM";
string endTime = "8:30 PM";

TimeSpan elapsed = DateTime.Parse(endTime).Subtract(DateTime.Parse(startTime));

Console.WriteLine($"Time elapsed: {elapsed}");

// Time elapsed: 13:30:00
```
The difference is 13 hours and 30 minutes.

## Date Elapsed

In the following example, we subtract two date values:

```c#
using System;

DateTime now = DateTime.Today;
DateTime borodino_battle = new DateTime(1812, 9, 7);

TimeSpan diff = now - borodino_battle;

Console.WriteLine($"{diff.TotalDays} days have passed since the Battle of Borodino.");

// 76021 days have passed since the Battle of Borodino.
```

On October 27, 2019, 76021 days have passed since the Battle of Borodino.

## DateTime vs TimeSpan

The `DateTime` and `TimeSpan` value types differ in that a `DateTime` represents an instant in time whereas a `TimeSpan` represents a time interval. You can subtract one instance of `DateTime` from another to obtain a `TimeSpan` object that represents the time interval between them. Or you could add a positive `TimeSpan` to the current `DateTime` to obtain a `DateTime` value that represents a future date.

You can add or subtract a time interval from a `DateTime` object. Time intervals can be negative or positive, and they can be expressed in units such as `ticks`, seconds, or as a `TimeSpan` object.

## Arithmetic Operations

A calculation using a `DateTime` structure, such as `Add` or `Subtract`, does not modify the value of the structure. Instead, the calculation returns a new `DateTime` structure whose value is the result of the calculation.

```c#
DateTime dt = new DateTime(2019, 2, 22, 14, 0, 0);

DateTime dt1 = dt.AddSeconds(55);
DateTime dt2 = dt.AddMinutes(30);
DateTime dt3 = dt.AddHours(72);
DateTime dt4 = dt.AddDays(65);
DateTime dt5 = dt.AddDays(-65);
DateTime dt6 = dt.AddMonths(3);
DateTime dt7 = dt.AddYears(4);

Console.WriteLine(dt1.ToString("F"));
Console.WriteLine(dt2.ToString("F"));
Console.WriteLine(dt3.ToString("F"));
Console.WriteLine(dt4.ToString("F"));
Console.WriteLine(dt5.ToString("F"));
Console.WriteLine(dt6.ToString("F"));
Console.WriteLine(dt7.ToString("F"));

/*
Friday, February 22, 2019 2:00:55 PM
Friday, February 22, 2019 2:30:00 PM
Monday, February 25, 2019 2:00:00 PM
Sunday, April 28, 2019 2:00:00 PM
Wednesday, December 19, 2018 2:00:00 PM
Wednesday, May 22, 2019 2:00:00 PM
Wednesday, February 22, 2023 2:00:00 PM
*/
```
## UTC Time

There is a pragmatic need for one global time. One global time helps to avoid confusion about time zones and daylight saving time. The UTC (Universal Coordinated time) was chosen to be the primary time standard. 

## c# Localized date

The DateTime allows us to display the date and time in a specific culture.

The example prints the current date and time in Slovak culture:


```c#
using System;
using System.Globalization;

// To output the accented Slovak characters correctly, we set the console output encoding to UTF8.
Console.OutputEncoding = System.Text.Encoding.UTF8;

DateTime now = DateTime.Now;

//We create a Slovak CultureInfo, which includes information about the names for the culture, the writing system, the calendar used, the sort order of strings, and formatting for dates and numbers.
CultureInfo ci = new CultureInfo("sk-SK");

// We print the date and time in full date and time format pattern.
Console.WriteLine($"Dnešný dátum a čas: {now.ToString("F", ci)}");

// Dnešný dátum a čas: utorok 27. októbra 2020 9:54:55
```

## Format time

```c#
using System;

DateTime now = DateTime.Now;

Console.WriteLine(now.ToString("d")); // short date pattern
Console.WriteLine(now.ToString("D")); // long date pattern
Console.WriteLine(now.ToString("F")); // full date and time pattern
Console.WriteLine(now.ToString("M")); // month and day pattern
Console.WriteLine(now.ToString("o")); // round-trip date and time pattern
Console.WriteLine(now.ToString("R")); // RFC1123 date and time pattern
Console.WriteLine(now.ToString("t")); // short time pattern
Console.WriteLine(now.ToString("T")); // long time pattern.
Console.WriteLine(now.ToString("Y")); // year and month pattern

/*
10/27/2020
Tuesday, October 27, 2020
Tuesday, October 27, 2020 10:09:01 AM
October 27
2020-10-27T10:09:01.2686960+01:00
Tue, 27 Oct 2020 10:09:01 GMT
10:09 AM
10:09:01 AM
October 2020
*/
```

### Custom format specifiers

```c#
using System;

DateTime now = DateTime.Now;

/*
The ddd specifier is the abbreviated name of the day of the week, the MMM is the abbreviated name of the month, the d is the day of the month, from 1 through 31. In the context of custom specifiers, it must be preceded with the % character. Finally, the yyyy is the year as a four-digit number.
*/
Console.WriteLine(now.ToString("ddd MMM %d, yyyy"));

/*
The hh specifier is the hour, using a 12-hour clock from 01 to 12, the mm is the minute, from 00 through 59, the ss is the second, from 00 through 59, and the tt is the AM/PM designator.
*/
Console.WriteLine(now.ToString("hh:mm:ss tt"));

// Tue Oct 27, 2020
// 10:10:57 AM
```

## Parse time

The DateTime's `Parse` method converts the string representation of a date and time to its `DateTime` equivalent.

```c#
using System;

string date_string = "11/5/2019";

DateTime dt = DateTime.Parse(date_string);
Console.WriteLine($"{dt:d MMMM, yyyy}");

// 5 November, 2019
```

## Time Zones

A time zone is a region throughout which the same standard time is used. There are 24 time zones in the world.

`UTC = local time + bias`

The bias is the difference between UTC time and local time.

`TimeZoneInfo` is a class for working with time zones in C#

```c#
using System;

TimeZoneInfo localZone = TimeZoneInfo.Local;

Console.WriteLine("Current timezone: {0}", localZone.StandardName);
Console.WriteLine("Daylight name: {0}", localZone.DaylightName);

Console.WriteLine("Bias: {0}", localZone.BaseUtcOffset);

// Current timezone: Central European Standard Time
// Daylight name: Central European Summer Time
// Bias: 01:00:00
```

Timezone information can also be retrieved from a `DateTime` value with some format specifiers.

```c#

Program.cs
using System;

DateTime now = DateTime.Now;

Console.WriteLine(now.ToString("%z"));
Console.WriteLine(now.ToString("%K"));
Console.WriteLine(now.ToString("o"));

// +1
// +01:00
// 2020-10-27T10:20:38.9478265+01:00
```
Conversion operations between time zones (such as between UTC and local time, or between one time zone and another) take daylight saving time into account, but arithmetic and comparison operations do not.

## Persisting values as integers

You can persist a date and time as an Int64 value that represents a number of ticks. In this case, you don't have to consider the culture of the systems the DateTime values are persisted and restored on.

To persist a DateTime value as an integer:

- If the DateTime values represent single moments in time, convert them to UTC by calling the ToUniversalTime method.
- Retrieve the number of ticks represented by the DateTime value from its Ticks property.

To restore a DateTime value that has been persisted as an integer:

- Instantiate a new DateTime object by passing the Int64 value to the DateTime(Int64) constructor.
- If the DateTime value represents a single moment in time, convert it from UTC to the local time by calling the ToLocalTime method.

The following example persists an array of DateTime values as integers on a system in the U.S. Pacific Time zone. It restores it on a system in the UTC zone. The file that contains the integers includes an Int32 value that indicates the total number of Int64 values that immediately follow it.

```c#
public static void PersistAsIntegers()
{
    SaveDatesAsInts();
    RestoreDatesAsInts();
}

private static void SaveDatesAsInts()
{
    DateTime[] dates = { new DateTime(2014, 6, 14, 6, 32, 0),
                   new DateTime(2014, 7, 10, 23, 49, 0),
                   new DateTime(2015, 1, 10, 1, 16, 0),
                   new DateTime(2014, 12, 20, 21, 45, 0),
                   new DateTime(2014, 6, 2, 15, 14, 0) };

    Console.WriteLine($"Current Time Zone: {TimeZoneInfo.Local.DisplayName}");
    Console.WriteLine($"The dates on an {Thread.CurrentThread.CurrentCulture.Name} system:");
    var ticks = new long[dates.Length];
    for (int ctr = 0; ctr < dates.Length; ctr++)
    {
        Console.WriteLine(dates[ctr].ToString("f"));
        ticks[ctr] = dates[ctr].ToUniversalTime().Ticks;
    }
    var fs = new FileStream(filenameInts, FileMode.Create);
    var bw = new BinaryWriter(fs);
    bw.Write(ticks.Length);
    foreach (var tick in ticks)
        bw.Write(tick);

    bw.Close();
    Console.WriteLine("Saved dates...");
}

private static void RestoreDatesAsInts()
{
    TimeZoneInfo.ClearCachedData();
    Console.WriteLine($"Current Time Zone: {TimeZoneInfo.Local.DisplayName}");
    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("en-GB");
    FileStream fs = new FileStream(filenameInts, FileMode.Open);
    BinaryReader br = new BinaryReader(fs);
    int items;
    DateTime[] dates;

    try
    {
        items = br.ReadInt32();
        dates = new DateTime[items];

        for (int ctr = 0; ctr < items; ctr++)
        {
            long ticks = br.ReadInt64();
            dates[ctr] = new DateTime(ticks).ToLocalTime();
        }
    }
    catch (EndOfStreamException)
    {
        Console.WriteLine("File corruption detected. Unable to restore data...");
        return;
    }
    catch (IOException)
    {
        Console.WriteLine("Unspecified I/O error. Unable to restore data...");
        return;
    }
    // Thrown during array initialization.
    catch (OutOfMemoryException)
    {
        Console.WriteLine("File corruption detected. Unable to restore data...");
        return;
    }
    finally
    {
        br.Close();
    }

    Console.WriteLine($"The dates on an {Thread.CurrentThread.CurrentCulture.Name} system:");
    foreach (var value in dates)
        Console.WriteLine(value.ToString("f"));

    Console.WriteLine("Restored dates...");
}
// When saved on an en-US system, the example displays the following output:
//       Current Time Zone: (UTC-08:00) Pacific Time (US & Canada)
//       The dates on an en-US system:
//       Saturday, June 14, 2014 6:32 AM
//       Thursday, July 10, 2014 11:49 PM
//       Saturday, January 10, 2015 1:16 AM
//       Saturday, December 20, 2014 9:45 PM
//       Monday, June 02, 2014 3:14 PM
//       Saved dates...
//
// When restored on an en-GB system, the example displays the following output:
//       Current Time Zone: (UTC) Dublin, Edinburgh, Lisbon, London
//       The dates on an en-GB system:
//       14 June 2014 14:32
//       11 July 2014 07:49
//       10 January 2015 09:16
//       21 December 2014 05:45
//       02 June 2014 23:14
//       Restored dates...
```