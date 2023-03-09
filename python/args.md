# Python command line arguments

```python
import sys
 
# total arguments
n = len(sys.argv)
print("Total arguments passed:", n)
 
# Arguments passed
print("\nName of Python script:", sys.argv[0])
 
print("\nArguments passed:", end = " ")
for i in range(1, n):
    print(sys.argv[i], end = " ")
     
# Addition of numbers
Sum = 0
for i in range(1, n):
    Sum += int(sys.argv[i])
     
print("\n\nResult:", Sum)

# python3 app.py 2 3 5 6
# Name of Python script: app.py
# Arguments passed: 2 3 5 6
# Result: 16
```