# Archiving

Archiving is one of the most common ways of persisting model objects in iOS.

Broadly speaking, `NSCoding` is the Objective-C way of archiving data and `Codable` is the Swift way. However, that doesn’t mean the two can’t work together – with a little work you can save any NSCoding data right inside Codable, which is helpful because many Apple types such as UIColor and UIImage conform to NSCoding but not Codable.
