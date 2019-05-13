# Ternary Operator

The `?` operator is called a conditional operator. It returns one of two values basing on the Boolean expression. If an expression equals true, the first value is returned; otherwise, the second value is returned. Here are 2 similar codes, for example:

Syntax:

```csharp
variable = Condition? Expression1 : Expression2;
```

Example:

```csharp
if (input<0)  // using the if-else construct
    classify = "negative";
else
    classify = "positive";

classify = (input < 0) ? "negative" : "positive";  // using the conditional operator ?:
```