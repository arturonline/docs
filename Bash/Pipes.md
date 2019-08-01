# Pipes

What does this | do? Among other things, it connects the standard output of the command on the left to the standard input of the command on the right. That is, it creates a special file, a pipe, which is opened as a write destinaton for the left command, and as a read source for the right command.

           echo foo               |                cat

 ---       +--------------+               ---       +--------------+
( 0 ) ---->| /dev/pts/5   |     ------>  ( 0 ) ---->|pipe (read)   |
 ---       +--------------+    /          ---       +--------------+
                              /
 ---       +--------------+  /            ---       +--------------+
( 1 ) ---->| pipe (write) | /            ( 1 ) ---->| /dev/pts     |
 ---       +--------------+               ---       +--------------+

 ---       +--------------+               ---       +--------------+
( 2 ) ---->| /dev/pts/5   |              ( 2 ) ---->| /dev/pts/    |
 ---       +--------------+               ---       +--------------+
