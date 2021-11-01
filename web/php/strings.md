# Strings

## Split String into Words

```php
$str = "Apple is healthy.";
$delimiter = ' ';
$words = explode($delimiter, $str);
 
foreach ($words as $word) {
    echo $word;
    echo "<br>";
}
```

## Split string by limit

```php
$str = "Hello Friend";

$arr = str_split($str, 3);

print_r($arr);

// Array
// (
//     [0] => Hel
//     [1] => lo
//     [2] => Fri
//     [3] => end
// )
```

## Remove punctuation marks

```php
$string = 'Hello, how are you?';

echo preg_replace('/[?|.|!]?/', '', $string);

// output: 'Hello, how are you';
```

## Function

substr
substr_replace
str_replace
strlen
strpos
ltrim(cad)
rtrim(cad)
trim(cad)
strtolower
strtoupper
strchr
strrchr
strrev
explode