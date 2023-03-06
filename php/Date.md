# Dates

`Date(format, data)` formats a local date and time, and returns the formatted date **string**.

```php
$today = date("d/m/Y");
$today2 = date("d-m-Y");
$today3 = date("d.m.Y");
```

## Format date

- d,D → month day
- m,M → month
- y,Y → year (4 digit)
- l → A full textual representation of a day
- F → A full textual representation of a month

## Format time

- h,H → 01 to 12, 00 to 23
- i → 00 to 59
- s → 00 to 59
- a,A → am or pm, AM or PM

```php
echo "Today is ".date("l, d-m-Y");
// Today is Monday, 19-07-2021
```

## mktime

The `mktime()` function is used to create the timestamp based on a specific date and time. If no date and time is provided, the timestamp for the current date and time is returned.

```php
$date = mktime(hour, minute, second, month, day, year)
```

once a date is created we can extract information as follows:

```php
$d = mktime(21,58,40,7,19,2021);
$info = getdate($d);
echo $info[“year”];
// 2021
```

```php
Array 
(
    [seconds] => 40
    [minutes] => 58
    [hours] => 21
    [mday] => 19
    [wday] => 2
    [mon] => 7
    [year] => 2021
    [weekday] => Monday
    [month]   => July
)
```

## Create a date

### 1. `date_create_from_format`

Parses a time string according to a specified format:

```php
$date = date_create_from_format('j-M-Y', '15-Feb-2021')
echo date_format($date, 'd-m-Y');

// 15-02-2021
```

🔗 [Date formats](https://www.php.net/manual/en/datetime.format.php)