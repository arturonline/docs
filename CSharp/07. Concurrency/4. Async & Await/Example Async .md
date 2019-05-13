# Control Flow in Async Programs

```csharp
public partial class MainWindow : Window
{
    // . . .
    private async void startButton_Click(object sender, RoutedEventArgs e)
    {
        // ONE
        Task<int> getLengthTask = AccessTheWebAsync();

        // FOUR
        int contentLength = await getLengthTask;

        // SIX
        resultsTextBox.Text +=
            String.Format("\r\nLength of the downloaded string: {0}.\r\n", contentLength);
    }

    async Task<int> AccessTheWebAsync()
    {
        // TWO
        HttpClient client = new HttpClient();
        Task<string> getStringTask =
            client.GetStringAsync("http://msdn.microsoft.com");

        // THREE
        string urlContents = await getStringTask;

        // FIVE
        return urlContents.Length;
    }
}
```

`ONE:`   Entering `startButton_Click`.
           Calling `AccessTheWebAsync`.

`TWO:`   Entering `AccessTheWebAsync`.
           Calling `HttpClient.GetStringAsync`.

`THREE:` Back in `AccessTheWebAsync`.
           Task `getStringTask` is started.
           About to `await getStringTask` & return a `Task<int>` to `startButton_Click`.

`FOUR:`  Back in `startButton_Click`.
           Task `getLengthTask` is started.
           About to `await getLengthTask` -- no caller to return to.

`FIVE:`  Back in `AccessTheWebAsync`.
           Task `getStringTask` is complete.
           Processing the return statement.
           Exiting from `AccessTheWebAsync`.

`SIX:`   Back in `startButton_Click`.
           Task `getLengthTask` is finished.
           Result from `AccessTheWebAsync` is stored in `contentLength`.
           About to display `contentLength` and exit.

Length of the downloaded string: 33946.