# LINQ to XML

You can load the XML document into memory, query, and modify the document
in an easy way using LINQ. The main advantage of LINQ to XML is you can use the LINQ with XML in the same manner as you use LINQ with object (LINQ to Object) or other providers.

## Create XML data

LINQ to XML provides the facility to create an XML document in an easy way.

```csharp
XElement rootElement = new XElement("RootElement");
rootElement.Add(new XElement("Name", "Hamza Ali"));
rootElement.Add(new XElement("Age", "21"));
rootElement.Add(new XElement("Address", "Pakistan"));
rootElement.Save("Sample.xml");
```

The output would look:

```xml
<RootElement>
<Name>Hamza Ali</Name>
<Age>21</Age>
<Address>Pakistan</Address>
</RootElement>
```

## Update XML data

```csharp
string xmlData = @" <RootElement>
                        <Name>Hamza Ali</Name>
                        <Age>21</Age>
                        <Address>Pakistan</Address>
                        </RootElement>";

XDocument document = new XDocument();
document = XDocument.Parse(xmlData);

//this will read the Name's Node if the age is 21
var readNode = (from p in document.Descendants()
                where p.Element("Age").Value == "21"
                select p.Element("Name")).FirstOrDefault();

Console.WriteLine("The person's Name having age 21 is: "+ readNode.Value);

//Update Name (Node) with value “Ali Asad”
readNode.ReplaceWith("Ali Asad");
Console.WriteLine("Node's Value is Updated");

//You can now save this Xml in Docuemnt/File
document.Save("Sample.xml");

//this will delete Address Node
document.Descendants().Where(s => s.Value == "Pakistan").Remove();
document.Save("Updated Sample 1.xml");
```

## Read XML data

```csharp
string xmlData = @" <RootElement>
                    <Name>Hamza Ali</Name>
                    <Age>21</Age>
                    <Address>Pakistan</Address>
                </RootElement>";

XDocument document = new XDocument();
document = XDocument.Parse(xmlData);
var xml = (from p in document.Elements()
            select p).ToList();

foreach (var item in xml)
{
    Console.WriteLine(item.ToString());
}
```

```csharp
// Read Specific Node

//this will read the Name's Node
var readNode = (from p in document.Descendants()
                select p.Element("Name")).FirstOrDefault();
Console.WriteLine(readNode);

//this query will read Name (Node)'s Value
var readNodeValue = (from p in document.Descendants()
                    select p.Element("Name").Value).FirstOrDefault();
Console.WriteLine(readNodeValue);

// You can also read the XML on the basis of some criteria, i.e.,

//this will read the Name's Node if the age is 21
var readNode = (from p in document.Descendants()
                where p.Element("Age").Value == "21"
                select p.Element("Name")).FirstOrDefault();
Console.WriteLine(readNode);
```
