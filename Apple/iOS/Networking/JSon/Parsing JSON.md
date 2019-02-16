# Parsing Json Snippet

[Source](https://medium.com/@nimjea/json-parsing-in-swift-2498099b78f)

>Before start check that you allow `NSALLOWARBITRARYLOADS`

## Case #1: Handle JSON without model

Our json:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  }
]
```

The network call:

```swift
guard let url = URL(string: "https://jsonplaceholder.typicode.com/todos") else {return}
let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
guard let dataResponse = data,
          error == nil else {
          print(error?.localizedDescription ?? "Response Error")
          return }  
    do {
        //here dataResponse received from a network request
        let jsonResponse = try JSONSerialization.jsonObject(with:
                               dataResponse, options: [])
        print(jsonResponse) //Response result
     } catch let parsingError {
        print("Error", parsingError)
   }
}
task.resume()
```

Example 1: To print a title

```swift
guard let jsonArray = jsonResponse as? [[String: Any]] else { return }
print(jsonArray)
//Now get title value
guard let title = jsonArray[0]["title"] as? String else { return } 
print(title) // delectus aut autem
```

Exxample 2: To print all title keys

```swift
for dic in jsonArray{
    guard let title = dic["title"] as? String else { return }  
    print(title) //Output
}
```

## Case #2 Use a model to handle JSON

User struct for data handling:

```swift
struct User: Codable{
       var userId: Int
       var id: Int
       var title: String
       var completed: Bool
}
```

Example: Getting a userId

```swift
var model = [User]() //Initialising Model Array
for dic in jsonArray{
    model.append(User(dic)) // adding now value in Model array
}
print(model[0].userId) // 1211
```

The same code with FlatMap:

```swift
var model = [User]()
model = jsonArray.flatMap{ (dictionary) in
    return User(dictionary)
        }
print(model[0].userId)

//make more simple
model = jsonArray.flatMap{ return User($0)}

//One more time
model = jsonArray.flatMap{User($0)}

//Or
model = jsonArray.flatMap(User.init)

//Output
print(model[0].userId) // 1211
```

## Parsing with JSONDecoder

Parsing an Array:

```swift
do {
    //here dataResponse received from a network request
    let decoder = JSONDecoder()
    let model = try decoder.decode([User].self, from: dataResponse)
    print(model)
} catch let parsingError {
    print("Error", parsingError)
}
```

Parsing a Dictionary:

```swift
do {
    //here dataResponse received from a network request
    let decoder = JSONDecoder()
    let model = try decoder.decode(User.self, from:
                 dataResponse) //Decode JSON Response Data 
    print(model.userId) //Output - 1221
} catch let parsingError {
    print("Error", parsingError)
}
```

## Custom Key names

```swift
struct User: Codable {
       var userId: Int
       var id: Int
       var title: String
       var completed: Bool
}
extension User{
   enum CodingKeys: String, CodingKey {
           case userId
           case id
           case title
           case completed
   }
}
```