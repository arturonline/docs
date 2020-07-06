# Virtual Environament

A virtual environment is a self-contained directory tree that contains a Python installation for a particular version of Python, plus a number of additional packages.

You should use a virtual environment to manage the dependencies for your project, both in development and in production.

## Create an environment

Create a project folder and a venv folder within:

```bash
mkdir myproject
cd myproject

# On linux:
python3 -m venv venv

# On Windows:
py -3 -m venv venv
```

## Activate the environment

Before you work on your project, activate the corresponding environment:

```bash
# On linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```