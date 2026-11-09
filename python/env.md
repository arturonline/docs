# Virtual Environment

A virtual environment is a self-contained directory tree with its own Python interpreter (a link/copy of a specific version) plus its own set of installed packages, isolated from the system Python.

Use one venv **per project**, both in development and in production.

See also: [pip](pip.md) (installing packages, `pyproject.toml`, uv) · [args](args.md)

## Create an environment

```bash
mkdir myproject
cd myproject

# Linux / macOS
python3 -m venv .venv

# Windows (py launcher; -3.13 picks a specific version)
py -3.13 -m venv .venv
```

> 💡 `.venv` is the conventional name (VS Code and uv detect it automatically). Add it to `.gitignore`; never commit it. Recreate it from `requirements.txt` / `pyproject.toml` instead.

## Activate / deactivate

```bash
# Linux / macOS (bash/zsh)
source .venv/bin/activate

# Windows - cmd
.venv\Scripts\activate.bat

# Windows - PowerShell
.venv\Scripts\Activate.ps1
# if blocked: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# Git Bash on Windows
source .venv/Scripts/activate

# leave the venv (any shell)
deactivate
```

Activation only puts the venv first in `PATH`. You can skip it and call the venv interpreter directly (useful in scripts, cron, CI):

```bash
.venv/bin/python app.py            # Linux / macOS
.venv\Scripts\python.exe app.py    # Windows
```

Check which Python is active:

```python
import sys
sys.prefix != sys.base_prefix   # -> True inside a venv
sys.executable                  # -> '/home/me/myproject/.venv/bin/python'
```

## Typical workflow

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install requests
python -m pip freeze > requirements.txt   # or declare deps in pyproject.toml

# on another machine
python -m venv .venv && source .venv/bin/activate
python -m pip install -r requirements.txt
```

### With uv (modern alternative)

[uv](https://docs.astral.sh/uv/) creates and manages the venv for you (and is much faster):

```bash
uv venv                 # creates .venv
uv add requests         # adds to pyproject.toml + installs into .venv
uv run app.py           # runs inside .venv, no activation needed
uv sync                 # recreate .venv from pyproject.toml / uv.lock
```

## Environment variables: `os.environ`

`os.environ` is a dict-like mapping of `str -> str`.

```python
import os

os.environ["HOME"]                      # KeyError if missing (Windows: "USERPROFILE")
os.environ.get("DEBUG")                 # -> None if missing
os.environ.get("PORT", "8000")          # -> '8000' (default)
port = int(os.getenv("PORT", "8000"))   # values are always str: convert them
debug = os.getenv("DEBUG", "0").lower() in {"1", "true", "yes"}

os.environ["MY_VAR"] = "hello"          # visible to this process and its children
del os.environ["MY_VAR"]

# pass a modified environment to a subprocess
import subprocess
subprocess.run(["python", "-c", "import os; print(os.environ['MODE'])"],
               env=os.environ | {"MODE": "test"})   # -> test
```

Set them from the shell:

```bash
# Linux / macOS
export DEBUG=1
DEBUG=1 python app.py          # only for this command

# Windows PowerShell
$env:DEBUG = "1"

# Windows cmd
set DEBUG=1
```

## `.env` files: python-dotenv

Keep secrets/config out of the code in a `.env` file (and out of git: add it to `.gitignore`).

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost/db
DEBUG=1
```

```bash
python -m pip install python-dotenv
```

```python
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()                     # reads .env into os.environ (does NOT override existing vars)
load_dotenv(override=True)        # .env wins over existing vars
os.environ["DATABASE_URL"]        # -> 'postgresql://user:pass@localhost/db'

config = dotenv_values(".env")    # -> {'DATABASE_URL': '...', 'DEBUG': '1'}  (doesn't touch os.environ)
```

> 💡 `uv run --env-file .env app.py` loads a `.env` file without python-dotenv.
