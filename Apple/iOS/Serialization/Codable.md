# Codable

## Encodable Protocol

A type that can encode itself to an external representation. It contains a single method:

`encode(to:)` — Encodes this value into the given encoder.

## Decodable Protocol

A type that can decode itself from an external representation. It also contains a single method:

`init(from:)` — Creates a new instance by decoding from the given decoder.

## Codable Protocol

A type that can convert itself into and out of an external representation.

`typealias Codable = Decodable & Encodable`

It includes the methods declared in both Encodable as well as Decodable.

```Swift
struct Product: Codable {
  var title:String
  var price:Double
  var quantity:Int

  enum CodingKeys: String, CodingKey {
    case title
    case price
    case quantity
  }
  init(title:String,price:Double, quantity:Int) {
    self.title = title
    self.price = price
    self.quantity = quantity
  }
  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(title, forKey: .title)
    try container.encode(price, forKey: .price)
    try container.encode(quantity, forKey: .quantity)
  }
  init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    title = try container.decode(String.self, forKey: .title)
    price = try container.decode(Double.self, forKey: .price)
    quantity = try container.decode(Int.self, forKey: .quantity)
  }
}
```

## Codable type

To encode and decode a custom type, we need to make it Codable.

The simplest way to make a type codable is to declare its properties using types that are already Codable:

1. Built-in Codable types — String, Int, Double, Data, URL
1. Array, Dictionary, Optional are Codable if they contain Codable types

The magic of the Codable protocol is that it has the power to automatically generate both of its required methods (encode and init) and the CodingKeys enum.

```Swift
struct Product: Codable {
  var title:String
  var price:Double
  var quantity:Int

  init(title:String,price:Double, quantity:Int) {
    self.title = title
    self.price = price
    self.quantity = quantity

}
```

## Coding Keys

Auto-generation is awesome, but there are still several circumstances where you will need to forego the convenience of auto-generation, and manually compose one or all of these. For example:

- One or more properties of the type may not be Codable. In this case, you’ll need to convert it to and from a Codable type.
- The structure of the type may differ from the structure you want to encode/decode.
- You may want to encode and decode different properties than the properties of the type.
- You may want to use different names for properties in the type.

For those cases we use coding keys:

Codable types can declare a special nested enumeration named CodingKeys that conforms to the CodingKey protocol. When this enumeration is present, its cases serve as the authoritative list of properties that must be included when instances of a codable type are encoded or decoded.

```Swift
struct Product: Codable {
  var title:String
  var price:Double
  var quantity:Int

  enum CodingKeys: String, CodingKey {
    case title
    case price
    case quantity
  }
```

## Archiving and unarchiving

And here is archiving and unarchiving the Product struct with Codable:

```Swift
func storeProducts() {
  do {
    let data = try PropertyListEncoder().encode(products)
    let success = NSKeyedArchiver.archiveRootObject(data, toFile: productsFile.path)
    print(success ? "Successful save" : "Save Failed")
  } catch {
    print("Save Failed")
  }
}
func retrieveProducts() -> [Product]? {
  guard let data = NSKeyedUnarchiver.unarchiveObject(withFile: productsFile.path) as? Data else { return nil }
  do {
    let products = try PropertyListDecoder().decode([Product].self, from: data)
    return products
  } catch {
    print("Retrieve Failed")
    return nil
  }
}
```