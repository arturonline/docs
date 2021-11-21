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

## Split string to array

by separator:

```php
$str1 = 'Hello world, my name is Marta';
$new = explode(" ", $str1);

echo "$new[0]";

// Hello
```

by limit:

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

## Functions

function | sintax | descrip
-|-|-
substr | `$sub=substr($cad, init, length);` | Returns a portion of string
substr_replace | `$new=substr_replace($original, $subcad, init, length);` | Replace text within a portion of a string
str_replace | `$new=str_replace($cad1,$cad2,$cad3);` | Replace all occurrences of the search string with the replacement string
strlen | `$len=strlen($cad);` | length of the string
strpos | `if(strpos($cad,$subcad)!=FALSE)` | Find the position of the first occurrence of a substring in a string
trim(cad) | `$scad=trim($cad);` | Strip all whitespace
ltrim(cad) | `$scad=ltrim($cad);` | strip left whitespaces
rtrim(cad) | `$scad=rtrim($cad);` | strip right whitespaces
strtolower | `$min=strtolower($cad);` | to lower
strtoupper | `$mai=strtoupper($cad);` | to upper
strchr | `$pos=strchr($cad,$search);` | Finds the first occurrence of a string inside another string
strrchr | `$pos=strrchr($cad,$search);` | Finds the last occurrence of a string inside another string
strrev | `$rev=strrev($cad);` | Reverses a string
explode | `$str=explode($separator,$cad)` | breaks a string into an array