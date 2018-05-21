# NSCoding

Classes who conform to the `NSCoding protocol` should implement `encode(with:)` and `init(coder:)`.

```Swift
class Item: NSObject, NSCoding {

    var name: String
    var valueInDollars: Int
    let dateCreated: Date


    init(name: String, serialNumber: String?, valueInDollars: Int) {
        self.name = name
        self.valueInDollars = valueInDollars
        self.dateCreated = Date()

        super.init()
    }
    func encode(with aCoder: NSCoder) {
        aCoder.encode(name, forKey: "name")
        aCoder.encode(dateCreated, forKey: "dateCreated")
        aCoder.encode(valueInDollars, forKey: "valueInDollars")
    }

    required init(coder aDecoder: NSCoder) {
        name = aDecoder.decodeObject(forKey: "name") as! String
        dateCreated = aDecoder.decodeObject(forKey: "dateCreated") as! Date
        valueInDollars = aDecoder.decodeInteger(forKey: "valueInDollars")

        super.init()
    }
}
```