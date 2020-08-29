# Parsing dates and times

Now that you know how to convert a date or time to a formatted String, you’ll find it easy to convert a String to a date or time. Just like the format() method, the parse() method takes a formatter as well. If you don’t specify one, it uses the default for that type.

```Java
DateTimeFormatter f = DateTimeFormatter.ofPattern("MM dd yyyy");
LocalDate date = LocalDate.parse("01 02 2015", f);
LocalTime time = LocalTime.parse("11:22");
System.out.println(date); // 2015-01-02
System.out.println(time); // 11:22

```

Here we show using both a custom formatter and a default value. This isn’t common, but you might have to read code that looks like this on the exam. Parsing is consistent in that if anything goes wrong, Java throws a runtime exception. That could be a format that doesn’t match the String to be parsed or an invalid date.