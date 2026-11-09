# Dates

> Prefer the `DateTimeImmutable` class (see [below](#datetimeimmutable-recommended)) over the procedural `date()`/`mktime()` functions: it handles time zones, intervals and comparisons, and is immutable (no accidental changes).

Always set the time zone (in `php.ini` → `date.timezone`, or in code):

```php
date_default_timezone_set('Europe/Madrid');
```

`date(format, timestamp)` formats a local date and time, and returns the formatted date **string**. If the timestamp is omitted, it uses the current time (`time()`).

```php
$today  = date("d/m/Y"); // 14/10/2026
$today2 = date("d-m-Y"); // 14-10-2026
$today3 = date("d.m.Y"); // 14.10.2026
```

## Format date

| char | meaning | example |
| ---- | ------- | ------- |
| `d` / `j` | day of the month, with / without leading zero | `05` / `5` |
| `D` / `l` | day of the week, short / full text | `Mon` / `Monday` |
| `N` | ISO day of the week (1 = Monday, 7 = Sunday) | `3` |
| `S` | English ordinal suffix (use with `j`) | `st`, `nd`, `th` |
| `z` | day of the year (starting from 0) | `286` |
| `W` | ISO week number | `42` |
| `m` / `n` | month number, with / without leading zero | `07` / `7` |
| `M` / `F` | month, short / full text | `Jul` / `July` |
| `t` | number of days in the month | `31` |
| `L` | leap year (1 or 0) | `0` |
| `y` / `Y` | year, 2 / 4 digits | `21` / `2021` |

## Format time

| char | meaning |
| ---- | ------- |
| `h` / `H` | hour 01 to 12 / 00 to 23 |
| `g` / `G` | hour 1 to 12 / 0 to 23 (no leading zero) |
| `i` | minutes 00 to 59 |
| `s` | seconds 00 to 59 |
| `a` / `A` | `am`/`pm` / `AM`/`PM` |
| `e` / `T` / `P` | time zone id / abbreviation / offset (`Europe/Madrid` / `CEST` / `+02:00`) |
| `U` | Unix timestamp |

```php
echo "Today is " . date("l, d-m-Y");
// Today is Monday, 19-07-2021

echo date('jS F Y g:i a', mktime(12, 0, 0, 7, 1, 2024));
// 1st July 2024 12:00 pm
```

Escape literal letters with `\`: `date('\T\o\d\a\y \i\s l')`.

🔗 [Date formats](https://www.php.net/manual/en/datetime.format.php)

## mktime

The `mktime()` function is used to create the timestamp based on a specific date and time. If no date and time is provided, the timestamp for the current date and time is returned.

```php
$date = mktime(hour, minute, second, month, day, year);
```

once a date is created we can extract information as follows:

```php
$d = mktime(21, 58, 40, 7, 19, 2021);
$info = getdate($d);
echo $info["year"];
// 2021
```

```php
print_r($info);

// Array
// (
//     [seconds] => 40
//     [minutes] => 58
//     [hours] => 21
//     [mday] => 19
//     [wday] => 1        (0 = Sunday ... 6 = Saturday)
//     [mon] => 7
//     [year] => 2021
//     [yday] => 199
//     [weekday] => Monday
//     [month] => July
//     [0] => 1626724720  (timestamp)
// )
```

Other functions:

```php
strtotime('next monday');          // timestamp from an English text, false on failure
checkdate(2, 29, 2023);            // false: validates month, day, year
```

## Create a date

### 1. `date_create_from_format`

Parses a time string according to a specified format:

```php
$date = date_create_from_format('j-M-Y', '15-Feb-2021');
echo date_format($date, 'd-m-Y');

// 15-02-2021
```

### 2. `DateTimeImmutable::createFromFormat`

Object-oriented equivalent. Prefix the format with `!` to reset the unspecified fields (time) to 0 instead of using the current time:

```php
$dt = DateTimeImmutable::createFromFormat('!d/m/Y', '15/02/2021');
echo $dt->format('Y-m-d H:i');
// 2021-02-15 00:00
```

⚠️ Invalid dates overflow instead of failing (`2023-02-30` → `2023-03-02`). To validate user input, check the warnings:

```php
$dt = DateTimeImmutable::createFromFormat('Y-m-d', '2023-02-30');
$errors = DateTimeImmutable::getLastErrors(); // false if there were no warnings/errors (PHP 8.2+)

if ($dt === false || $errors !== false) {
    echo 'Invalid date';
}
// Invalid date   ("The parsed date was invalid")
```

## DateTimeImmutable (recommended)

```php
$now  = new DateTimeImmutable();                // now
$date = new DateTimeImmutable('2024-01-31');    // from string
$ts   = new DateTimeImmutable('@1719835200');   // from Unix timestamp (UTC)

echo $date->format('d/m/Y');    // 31/01/2024
echo $ts->getTimestamp();       // 1719835200
```

Every modification returns a **new** object:

```php
$a = new DateTimeImmutable('2024-01-01');
$a->modify('+1 day');                     // ignored! (PHP 8.5 even warns about it)
echo $a->format('Y-m-d');                 // 2024-01-01
echo $a->modify('+1 day')->format('Y-m-d'); // 2024-01-02

// With the mutable DateTime the original object is changed
$m = new DateTime('2024-01-01');
$m->modify('+1 day');
echo $m->format('Y-m-d');                 // 2024-01-02
```

### Add / subtract

```php
$date = new DateTimeImmutable('2024-01-31');

echo $date->modify('+1 month')->format('Y-m-d');                // 2024-03-02  (31 Feb overflows!)
echo $date->modify('last day of next month')->format('Y-m-d');  // 2024-02-29
echo $date->add(new DateInterval('P1Y2M10D'))->format('Y-m-d'); // 2025-04-10
echo $date->sub(new DateInterval('PT36H'))->format('Y-m-d H:i'); // 2024-01-29 12:00
```

`DateInterval` format: `P` + `nY nM nD` (period) + `T` + `nH nM nS` (time). E.g. `P1W`, `PT30M`.

### Difference between dates

```php
$diff = (new DateTimeImmutable('2024-01-01'))->diff(new DateTimeImmutable('2024-03-15 12:00'));

echo $diff->days;                                       // 74 (total days)
echo $diff->format('%m months, %d days, %h hours');    // 2 months, 14 days, 12 hours

// Age
$birth = new DateTimeImmutable('1990-05-20');
echo $birth->diff(new DateTimeImmutable('2026-10-14'))->y; // 36
```

### Compare

```php
var_dump(new DateTimeImmutable('2024-01-01') < new DateTimeImmutable('2024-06-01'));
// bool(true)
```

### Time zones

Store dates in UTC and convert them for display:

```php
$utc = new DateTimeImmutable('2024-07-01 12:00', new DateTimeZone('UTC'));

echo $utc->setTimezone(new DateTimeZone('Europe/Madrid'))->format('Y-m-d H:i T P');
// 2024-07-01 14:00 CEST +02:00

echo $utc->format(DateTimeInterface::ATOM);
// 2024-07-01T12:00:00+00:00   (ISO 8601, useful for APIs/JSON)
```

### Periods

```php
$period = new DatePeriod(new DateTimeImmutable('2024-01-01'), new DateInterval('P1W'), 3);

foreach ($period as $day) {
    echo $day->format('D d/m ');
}
// Mon 01/01 Mon 08/01 Mon 15/01 Mon 22/01   (start date + 3 recurrences)
```

### Localized dates

`date()` only produces English names. For other languages use `IntlDateFormatter` (`intl` extension; `strftime()` is deprecated since PHP 8.1):

```php
$fmt = new IntlDateFormatter('es_ES', IntlDateFormatter::FULL, IntlDateFormatter::NONE, 'Europe/Madrid');
echo $fmt->format(new DateTimeImmutable('2024-07-01'));
// lunes, 1 de julio de 2024
```
