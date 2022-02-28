# Comparison Operators

Use comparison operators (`-eq`, `-ne`, `-gt`, `-lt`, `-le`, `-ge`) to compare values and test conditions.

The comparison operators include:

- **match** operators (`-match`, `-notmatch`), which find patterns by using regular expressions;
- **replace** operator (`-replace`), which uses regular expressions to change input values;
- **like** operators (`-like`, `-notlike`), which find patterns using wildcard characters (`*`);
- **containment** operators (`-in`, `-notin`, `-contains`, `-notcontains`), which determine whether a test value appears in a reference set.

> 💡 about_Comparison_Operators

## Example

```powershell
# Replace characters in a string:
PS C:\> "abcdef" -replace "dEf","xyz"

# Replace characters in a variable:
PS C:\> $demo = "abcdef"
PS C:\> $demo.replace("dEf","xyz")
abcxyz
```
