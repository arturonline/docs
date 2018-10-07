# Javascript Typed arrays

JavaScript typed arrays are array-like objects and provide a mechanism for accessing raw binary data. Not all methods available for normal arrays are supported by typed arrays.

To achieve maximum flexibility and efficiency, JavaScript typed arrays split the implementation into buffers and views. A buffer (implemented by the ArrayBuffer object) is an object representing a chunk of data; it has no format to speak of and offers no mechanism for accessing its contents. In order to access the memory contained in a buffer, you need to use a view. A view provides a context — that is, a data type, starting offset, and the number of elements — that turns the data into a typed array.