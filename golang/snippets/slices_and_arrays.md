# Slice and Arrays snippets

```go
func removeIndex(s []int, i int) []int {
	s = append(s[:2], s[2+1:]...)
	return s
}
```

ideas:

```go
spam = ['hello', 'hi', 'howdy', 'heyas']
spam.index('hello')
>>>0
```

The `insert()` method can insert a value at any index in the list.

```go
spam = ['cat', 'dog', 'bat']
spam.insert(1, 'chicken')
spam
>>>['cat', 'chicken', 'dog', 'bat']
```
