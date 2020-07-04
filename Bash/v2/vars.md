# Bash: Scripting

## Create script

Create a file my_script.sh with:

```bash
#!/bin/bash

# comment
```

Permissions:

```bash
chmod +x my_script.sh
```

## Variables

To store data in a variable, we use the following assignment syntax:

```bash
varname=vardata
```

you cannot use spaces around the = sign in an assignment.

```bash
varname = vardata     # This is wrong!
```
To expand variable values:


```bash
echo "$HOME"
# or
echo ${prize}"
```

### Variables can be unset

```bash
TMPDIR=/tmp

unset TMPDIR
```

## Quotes

Single quotes will literally `echo` what you have between them, while double quotes will evaluate variables between them and output the value of the variable:

```bash
$ MYVAR=sometext
$ echo "double quotes gives you $MYVAR"
$ echo 'single quotes gives you $MYVAR'

double quotes gives you sometext
single quotes gives you $MYVAR
```

⚠️  Double quotes group everything inside them into a single argument:

```bash
The secret voice in your head.mp3    # a mp3 file
$ rm The secret voice in your head.mp3    # Executes rm with 6 arguments; not 1!
```

This is what we should have done:

```bash
rm "The secret voice in your head.mp3"
```

⚠️  Remember to put double quotes around every parameter expansion!

## Positional parameters 

parameter | action
-|-
`$0` | script name
`$1 - $9` | positional argument
`$#` | how many arguments
`$*` | to get all arguments
`$?` | result of the last execution
`$$` | PID of the process is running

## Read Input

```bash
read -p "message" variable1 variable2 variableN
```

Example:

```bash
#!/bin/bash

read -p "Please give your name and last name: " name surname

echo "Your name is $name"
echo "Your surname is $surname"
```






































