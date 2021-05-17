# String Format

## Syntax

```c#
{index[,alignment][:formatString]}
```
- **Index**: The zero-based index of the argument whose string representation is to be included at this position in the string. 

    ```c#
    DateTime dat = new DateTime(2012, 1, 17, 9, 30, 0); 
    string city = "Chicago";
    int temp = -16;
    string output = String.Format("At {0} in {1}, the temperature was {2} degrees.",
                                dat, city, temp);
    Console.WriteLine(output);
    // The example displays output like the following:
    //    At 1/17/2012 9:30:00 AM in Chicago, the temperature was -16 degrees.
    ```

- **Alignment**: Optional. A signed integer that indicates the total length of the field into which the argument is inserted and whether it is right-aligned (a positive integer) or left-aligned (a negative integer). If you omit alignment, the string representation of the corresponding argument is inserted in a field with no leading or trailing spaces. If the value of alignment is less than the length of the argument to be inserted, alignment is ignored and the length of the string representation of the argument is used as the field width.

    ```c#
    var value = String.Format("{0,20:C}", 126347.89m);         
    Console.WriteLine(value);

    //         126.347,89 €
    ```

- **FormatString**: Optional. A string that specifies the format of the corresponding argument's result string. If you omit formatString, the corresponding argument's parameterless ToString method is called to produce its string representation. If you specify formatString, the argument referenced by the format item must implement the IFormattable interface.

    ```c#
    // Create array of 5-tuples with population data for three U.S. cities, 1940-1950.
    Tuple<string, DateTime, int, DateTime, int>[] cities = 
        { Tuple.Create("Los Angeles", new DateTime(1940, 1, 1), 1504277, 
                    new DateTime(1950, 1, 1), 1970358),
        Tuple.Create("New York", new DateTime(1940, 1, 1), 7454995, 
                    new DateTime(1950, 1, 1), 7891957),  
        Tuple.Create("Chicago", new DateTime(1940, 1, 1), 3396808, 
                    new DateTime(1950, 1, 1), 3620962),  
        Tuple.Create("Detroit", new DateTime(1940, 1, 1), 1623452, 
                    new DateTime(1950, 1, 1), 1849568) };

    // Display header
    var header = String.Format("{0,-12}{1,8}{2,12}{1,8}{2,12}{3,14}\n",
                                "City", "Year", "Population", "Change (%)");
    Console.WriteLine(header);
    foreach (var city in cities) {
    var output = String.Format("{0,-12}{1,8:yyyy}{2,12:N0}{3,8:yyyy}{4,12:N0}{5,14:P1}",
                            city.Item1, city.Item2, city.Item3, city.Item4, city.Item5,
                            (city.Item5 - city.Item3)/ (double)city.Item3);
    Console.WriteLine(output);
    }
    // The example displays the following output:
    //    City            Year  Population    Year  Population    Change (%)
    //  
    //    Los Angeles     1940   1,504,277    1950   1,970,358        31.0 %
    //    New York        1940   7,454,995    1950   7,891,957         5.9 %
    //    Chicago         1940   3,396,808    1950   3,620,962         6.6 %
    //    Detroit         1940   1,623,452    1950   1,849,568        13.9 %
    ```

## Xamarin

Inside binding:

```xml
<Label Text="{Binding Id, StringFormat='{0:N}'}"/>
```
```c#
Label label = new Label();
label.AddBinding (new Binding (Label.TextProperty, "Price") {
  StringFormat = "Price: {0:C2}"
});
```

As a resource:

```xml
<x:String x:Key="formatdatetimelong">ddMMMyy HH:mm:ss.fff tt</x:String>
<x:String x:Key="formattimewithoutseconds">{0:h:mm tt}</x:String>
<x:String x:Key="formatdatetimewithoutseconds">{0:M/d/yy h:mm tt}</x:String>
<x:String x:Key="formatdecimalzeroplaces">{0:0}</x:String>
<x:String x:Key="formatdecimaloneplaces">{0:0.0}</x:String>
<x:String x:Key="formatdecimaltwoplaces">{0:0.00}</x:String>
<x:String x:Key="formatdecimalthreeplaces">{0:0.000}</x:String>
<x:String x:Key="formatdecimalfourplaces">{0:0.0000}</x:String>
<x:String x:Key="formatphonenumberusa">{0:(###) ###-####}</x:String>
<x:String x:Key="formatcurrencyusa">{0:$#,##0.00;($#,##0.00);Zero}</x:String>
<x:String x:Key="formatpercent">{0:0%}</x:String>
```

```xml
<Label Text="{Binding someProperty, StringFormat={StaticResource formatdatetimelong}"} />
```

## Numbers

### Basic

Specifier | Type | Format | Output with 1.42 | Output with -12400
-|-|-|-|-
c | Currency | `{0:c}` | $1.42 | -$12,400
d | Decimal | `{0:d}` | `Error` | 12400
e | Scientific | `{0:e}` | 1.420000e+000 | -1.240000e+004
f | Fixed point | `{0:f}` | 1.42 | -12400.00
g | General | `{0:g}` | 1.42 | -12400
n | num with commas | `{0:n}` | 1.42 | -12,400
r | Round trippable | `{0:r}` | 1.42 | `Error`
x | Hexadecimal | `{0:x4}`| `Error` | cf90

### Custom

Specifier | Type | Example | Output with 1500.42 | Note
-|-|-|-|-
`0` | Zero Placeholder | `{0:00.0000}` | 1500.4200 | Pads with zeroes
`#` | Digit Placeholder | `{0:(#).##}` | (1500).42 |
`.` | Decimal Point | `{0:0.0}` | 1500.4 |
`,` | Thousand separator | `{0:0,0} | 1,500 | Must be between two zeroes
`.,` | Number scaling | `{0:0%}` 2 | Comma adjacent to period scales by 1000
`%` | Percent | `{0:0%}` | 150042% | Multiplies by 100, adds % sign
`e` | Exponen placeholder | `{0:00e+0}` | 15e+2 | Many exponent formats available
`;` | Group separator | see below

The group separator is especially useful for formatting currency values which require that negative values be enclosed in parentheses:

`String.Format("{0:$#,##0.00;($#,##0.00);Zero}", value);
`
This will output `"$1,240.00"` if passed 1243.50. It will output the same format but in parentheses if the number is negative, and will output the string "Zero" if the number is zero.

`String.Format("{0:(###) ###-####}", 8005551212);
`
This will output "(800) 555-1212".


### Dates

Specifier | Type | Output with DateTime.Now
-|-|-
`d` | Short date | `10/12/2002`
`D` | Long date | `December 10, 2002`
`t` | Short time | `10:11 PM`
`T` | Long date | `10:11.29 PM`
`f` | Full date & time | `December 10, 2002 10:11 PM`
`F` | Full date & time (long) | `December 10, 2002 10:11:29 PM`
`g` | Default date & time | `10/12/2002 10:11 PM`
`G` | Default date & time (long) | `10/12/2002 10:11:29 PM`
`M` | Month day pattern | `December 10`
`r` | RFC1123 date String | `Tue, 10 Dec 2002 22:11:29 GMT`
`s` | Sortable date string | `2002-12-10T22:11:29`
`u` | Universal sortable, local time | `2002-12-10 22.13:50Z`
`U` | Universal sortable, GMT | `December 11, 2002 3:13:50 AM`
`Y` | Year month patter | `December, 2002`

### Custom date formating

Specifier | Type | Example | Example Output
-|-|-|-
`dd` | Day | `{0:dd}` | 10
`ddd` | Day name | `{0:ddd}` | Tue
`dddd` | Full day name | `{0:dddd}` | Tuesday
`f`, `ff`, ... | Second fractions | `{0:fff}` | 932
`gg`, ... | Era | `{0:gg}` | A.D.
`hh` | 2 digit hour | `{0:hh}` | 10
`HH` | 2 digit hour, 24hr format | `{0:HH}` | 22
`mm` | Minute 00-59 | `{0:mm}` | 38
`MM` | Month 01-12 | `{0:MM}` | 12
`MMM` | Month abbreviation | `{0:MMM}` | Dec
`MMMM` | Full month name | `{0:MMMM}` | December
`ss` | Seconds 00-59 | `{0:ss}` | 46
`tt` | AM or PM | `{0:tt}` | PM
`yy` | Year, 2 digits | `{0:yy}` | 02
`yyyy` | Year | `{0:yyyy}` | 2002
`zz` | Timezone offset, 2 digits | `{0:zz}` | -05
`zzz` | Full timezone offset | `{0:zzz}` | -05:00
`:` | Separator | `{0:hh:mm:ss}` | 10:43:20
`/` | Separator | `{0:dd/MM/yyyy}` | 10/12/2002