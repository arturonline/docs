# Anchor Tag Helper in ASP.NET Core

SpeakerController is used in samples throughout this document:

```C#
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

public class SpeakerController : Controller
{
    private List<Speaker> Speakers =
        new List<Speaker>
        {
            new Speaker {SpeakerId = 10},
            new Speaker {SpeakerId = 11},
            new Speaker {SpeakerId = 12}
        };

    [Route("Speaker/{id:int}")]
    public IActionResult Detail(int id) =>
        View(Speakers.FirstOrDefault(a => a.SpeakerId == id));

    [Route("/Speaker/Evaluations", 
           Name = "speakerevals")]
    public IActionResult Evaluations() => View();

    [Route("/Speaker/EvaluationsCurrent",
           Name = "speakerevalscurrent")]
    public IActionResult Evaluations(
        int speakerId,
        bool currentYear) => View();

    public IActionResult Index() => View(Speakers);
}

public class Speaker
{
    public int SpeakerId { get; set; }
}
```

## asp-controller

The asp-controller attribute assigns the controller used for generating the URL.

```c#
<a asp-controller="Speaker"
   asp-action="Index">All Speakers</a>
```

The generated HTML:

```c#
<a href="/Speaker">All Speakers</a>
```