# php forms

$_REQUEST, by default, contains the contents of $_GET, $_POST and $_COOKIE.

But it's only a default, which depends on variables_order;

- You should use $_GET when someone is requesting data from your application.
- And you should use $_POST when someone is pushing (inserting or updating ; or deleting) data to your application.

As a rule, you should only use GET forms if, when the form is submitted, nothing on the server changes—such as when you’re requesting a list of search results.

If I had to choose, I would probably not use $_REQUEST, and I would choose $_GET or $_POST -- depending on what my application should do (i.e. one or the other, but not both) : generally speaking :

Either way, there will not be much of a difference about performances : the difference will be negligible, compared to what the rest of your script will do.

## Test data

We need to test data from the form before use it.

- isset($var) -> var is not null
- is_null($var) -> var is null
- empty($var) -> var is empty (null, 0, false, "") or does not exist.

- strip_tags($var) -> removes html and php tags from var
- htmlspecialchars($_GET["nombre"], ENT_QUOTES, 'UTF-8'));

## filters
