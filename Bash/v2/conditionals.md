# Conditionals

## Comparing Numbers

Operator | Meaning
-|-
`-lt` | Less than
`-gt` | Greater than
`-le` | Less than or equal
`-ge` | Greater than or equal
`-eq` | Equal to
`-ne` | Not equal 


## Comparing Strings

Operator | Meaning 
-|-
`=` | The strings are equal
`!=` The strings are not equal
`<` | Less than (alphabetic order ASCII)
`>` | Greater than (alphabetic order ASCII)
`-n` | String is not empty
`-z` | String is empty

## Comparing Files

Operator | Result
-|-
`-e name` | File called with the name exists
`-f name` | name is a regular file (not directory)
`-s name` | name exists, and the size is not 0
`-d name` | name is a directory
`-r name` | has read permission in name 
`-w name` | has write permission in name 
`-x name` | has execution permission in name 

## Positional parameters

parameter | action
-|-
`$0` | script name
`$1 - $9` | positional argument
`$#` | arguments number
`$*` | to get all arguments
`$?` | result of the last execution
`$$` | PID of the process is running


## Testing Conditions with `[  ]`

```bash
[ condition  ]

[ ! condition  ]

[ condition  ] && true-command

[ condition  ] || false-command

[ condition  ] && true-command || false-command
```
