# Strings

> See also: [arrays](array.md) (`implode`, `array_map` over strings), [forms](forms.md) (escaping with `htmlspecialchars`).

## Quotes, interpolation, heredoc

```php
$name = 'Ana';
$arr  = ['k' => 'v'];
$obj  = new stdClass();
$obj->p = 'prop';

echo 'Hi $name\n';   // single quotes: literal -> Hi $name\n
echo "Hi $name, {$arr['k']}, $arr[k], {$obj->p}, {$name}s\n";
// Hi Ana, v, v, prop, Anas
```

> ⚠️ `"${name}"` interpolation is **deprecated since PHP 8.2**: use `"{$name}"` or `"$name"`.

Heredoc (interpolates) and nowdoc (literal). Since PHP 7.3 the closing marker can be indented, and that indentation is removed from every line:

```php
$html = <<<EOT
    Name: $name
      Indented
    EOT;
echo $html;
// Name: Ana
//   Indented

echo <<<'EOT'
Raw $name
EOT;
// Raw $name
```

Concatenation: `.` and `.=`

```php
$s = 'Hello';
$s .= ' world';  // Hello world
```

## Split String into Words

```php
$str = "Apple is healthy.";
$words = explode(' ', $str);

foreach ($words as $word) {
    echo $word . "<br>";
}
// Apple<br>is<br>healthy.<br>
```

Split by any whitespace (several spaces, tabs...):

```php
print_r(preg_split('/\s+/', "  one  two\tthree ", -1, PREG_SPLIT_NO_EMPTY));
// Array ( [0] => one [1] => two [2] => three )
```

## Split string to array

by separator:

```php
$str1 = 'Hello world, my name is Marta';
$new = explode(" ", $str1);

echo $new[0];
// Hello

print_r(explode(',', 'a,b,c,d', 2)); // limit: Array ( [0] => a [1] => b,c,d )
```

by length:

```php
$str = "Hello Friend";

$arr = str_split($str, 3);

print_r($arr);

// Array
// (
//     [0] => Hel
//     [1] => lo        ("lo " with the space)
//     [2] => Fri
//     [3] => end
// )
```

> For multibyte (UTF-8) strings use `mb_str_split()`.

Join an array into a string:

```php
echo implode(', ', ['a', 'b']); // a, b
```

## Remove punctuation marks

```php
$string = 'Hello, how are you?';

// Only ? . ! (inside [] the | is a literal char, not "or")
echo preg_replace('/[?.!]/', '', $string);
// Output: Hello, how are you

// Every ASCII punctuation mark
echo preg_replace('/[[:punct:]]/', '', $string);
// Output: Hello how are you

// Unicode punctuation (¡ ¿ « »...): \p{P} with the u modifier
echo preg_replace('/\p{P}/u', '', '¡Hola, qué tal?');
// Output: Hola qué tal
```

## Search

```php
// PHP 8.0: return bool, no position-0 trap
var_dump(str_contains('Hello world', 'world'));  // bool(true)
var_dump(str_starts_with('Hello', 'He'));        // bool(true)
var_dump(str_ends_with('file.php', '.php'));     // bool(true)

// strpos returns the position (int) or false
var_dump(strpos('abc', 'a'));            // int(0)
var_dump(strpos('abc', 'a') != false);   // bool(false)  ⚠️ wrong: 0 == false
var_dump(strpos('abc', 'a') !== false);  // bool(true)   ✅ always use !== false
```

## Regular expressions

```php
if (preg_match('/(\d{4})-(\d{2})/', 'Date: 2024-05', $m)) {
    print_r($m);
}
// Array ( [0] => 2024-05 [1] => 2024 [2] => 05 )

preg_match_all('/\d+/', 'a1 b20 c3', $all);     // $all[0] = ['1', '20', '3']

echo preg_replace_callback('/\d+/', fn($m) => $m[0] * 2, 'a1 b20');
// a2 b40
```

## Format

```php
echo sprintf('%05.2f|%-6s|%+d|%x|%b', 3.14159, 'ab', 5, 255, 5);
// 03.14|ab    |+5|ff|101

printf('%s has %d items', 'Cart', 3);  // prints directly: Cart has 3 items

echo number_format(1234567.891, 2, ',', '.'); // 1.234.567,89 (Spanish format)
echo number_format(1234.5);                   // 1,235

echo str_pad('7', 3, '0', STR_PAD_LEFT);      // 007
echo str_repeat('-', 5);                      // -----
echo strtr('Hi {name}', ['{name}' => 'Ana']); // Hi Ana  (simple templates)
echo wordwrap('The quick brown fox', 10, "\n", true);
// The quick
// brown fox
```

## Multibyte (UTF-8)

Most `str*` functions work on **bytes**. For accents, ñ, emojis... use the `mb_*` functions:

```php
echo strlen('cañón');          // 7  (bytes)
echo mb_strlen('cañón');       // 5  (characters)
echo strtoupper('cañón');      // CAñóN  (ASCII only since PHP 8.2)
echo mb_strtoupper('cañón');   // CAÑÓN
echo mb_substr('cañón', 0, 3); // cañ

// PHP 8.4
echo mb_ucfirst('ñandú');           // Ñandú
echo mb_trim('  ñ  ');              // ñ
echo mb_str_pad('ñ', 3, '*', STR_PAD_BOTH); // *ñ*
```

## Compare

```php
var_dump(strcmp('a', 'b'));             // int(-1)  (<0, 0, >0)
var_dump(strcasecmp('HELLO', 'hello')); // int(0)   case-insensitive
var_dump('abc' <=> 'abd');              // int(-1)  spaceship operator
var_dump(strnatcmp('img12', 'img10'));  // int(1)   "natural" order (img2 < img10)
echo levenshtein('kitten', 'sitting');  // 3 (edit distance)
```

## Functions

function | syntax | description
-|-|-
substr | `$sub = substr($cad, $start, $length);` | Returns a portion of string. Negative `$start` counts from the end: `substr('Hello world', -5)` → `world`
substr_replace | `$new = substr_replace($original, $replacement, $start, $length);` | Replace text within a portion of a string: `substr_replace('Hello world', 'PHP', 6, 5)` → `Hello PHP`
str_replace | `$new = str_replace($search, $replace, $subject);` | Replace all occurrences (accepts arrays): `str_replace(['a','e'], ['4','3'], 'banana tree')` → `b4n4n4 tr33`
str_ireplace | `$new = str_ireplace($search, $replace, $subject);` | Case-insensitive `str_replace`
strlen | `$len = strlen($cad);` | Length of the string in bytes (`mb_strlen` for characters)
strpos | `if (strpos($cad, $subcad) !== false)` | Position of the first occurrence of a substring, or `false`
str_contains | `if (str_contains($cad, $subcad))` | Whether the string contains the substring (PHP 8.0)
trim | `$scad = trim($cad);` | Strip whitespace (or other chars: `trim('--x--', '-')` → `x`) from both ends
ltrim | `$scad = ltrim($cad);` | Strip left whitespace
rtrim | `$scad = rtrim($cad);` | Strip right whitespace
strtolower | `$min = strtolower($cad);` | To lower (ASCII; `mb_strtolower` for UTF-8)
strtoupper | `$may = strtoupper($cad);` | To upper (ASCII; `mb_strtoupper` for UTF-8)
ucfirst / ucwords | `ucwords('hello world')` | `Hello world` / `Hello World`
strstr (alias strchr) | `$rest = strstr($cad, $search);` | Returns the part from the first occurrence: `strstr('user@mail.com', '@')` → `@mail.com` (`true` as 3rd arg → `user`)
strrchr | `$rest = strrchr($cad, $char);` | Returns the part from the last occurrence of a char: `strrchr('a/b/c.txt', '/')` → `/c.txt`
strrev | `$rev = strrev($cad);` | Reverses a string: `olleh`
str_word_count | `str_word_count('The quick brown')` | Number of words: `3`
substr_count | `substr_count('hello hello', 'll')` | Number of occurrences: `2`
nl2br | `nl2br("a\nb")` | Inserts `<br />` before newlines
explode | `$arr = explode($separator, $cad);` | Breaks a string into an array
implode | `$cad = implode($separator, $arr);` | Joins array elements into a string

🔗 [All string functions](https://www.php.net/manual/en/ref.strings.php)
