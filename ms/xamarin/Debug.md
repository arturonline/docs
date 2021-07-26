# Debug

## Tips and Tricks

StopWatch:

````c#
var stopwatch = new Stopwatch();
stopwatch.Start();

// Code Here

Debug.WriteLine("****** 10.000 Familias filtradas *****");
Debug.WriteLine("Total: {0} segs", stopwatch.Elapsed.TotalSeconds);

````
