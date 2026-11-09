# pip

**pip** is the standard package installer for Python. It installs packages from [PyPI](https://pypi.org/) into the current interpreter / [virtual environment](env.md).

> 💡 Always install into a venv, and prefer `python -m pip` over `pip`: it guarantees you use the pip of the Python you expect (on Windows: `py -m pip`).

See also: [env](env.md) (venv, environment variables) · [modules](modules.md) (imports, packages)

## Installing pip

pip ships with Python (3.4+) and inside every venv. If it is missing:

```bash
python -m ensurepip --upgrade        # preferred
python -m pip install --upgrade pip  # update it

# last resort: get-pip.py
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

> ⚠️ On recent Linux distros (Debian/Ubuntu, Fedora...) the system Python is *externally managed* (PEP 668): `pip install` outside a venv fails with `error: externally-managed-environment`. Use a venv, `pipx` (for tools), or the distro package manager. Don't use `--break-system-packages` unless you know why.

## Commands

```bash
python -m pip help
python -m pip --version             # pip 25.x from ... (python 3.13)

python -m pip install requests
python -m pip install "requests==2.32.3"   # exact version
python -m pip install "requests>=2.31"     # minimum version (quote it: > is a shell redirect!)
python -m pip install "requests~=2.32"     # compatible: >=2.32, <3.0
python -m pip install --upgrade requests   # -U
python -m pip install -e .                 # editable install of the current project (needs pyproject.toml)
python -m pip install "httpx[http2]"       # with optional extras

python -m pip uninstall requests
python -m pip show requests        # version, location, dependencies
python -m pip list                 # installed packages
python -m pip list --outdated      # packages with newer versions
python -m pip check                # verify dependencies are compatible
python -m pip index versions requests   # available versions on PyPI
```

> ⚠️ `pip search` no longer works (PyPI disabled the API). Search on <https://pypi.org>.

## `freeze` and `requirements.txt`

`pip freeze` prints the installed packages pinned, in the format that `pip install -r` expects:

```bash
python -m pip freeze > requirements.txt
```

```text
# requirements.txt
certifi==2025.8.3
requests==2.32.3
urllib3==2.5.0
```

Commit `requirements.txt` to version control; anyone can then recreate the environment:

```bash
python -m pip install -r requirements.txt
```

> 💡 `freeze` lists **everything** (including sub-dependencies). For a library, list only direct dependencies in `pyproject.toml`; a frozen `requirements.txt` (or a lock file like `uv.lock`) is for reproducible app deploys.

## `pyproject.toml`

The modern, standard place for project metadata and dependencies (replaces `setup.py` / `setup.cfg`):

```toml
[project]
name = "myapp"
version = "0.1.0"
description = "My app"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31",
    "python-dotenv>=1.0",
]

[project.optional-dependencies]
dev = ["pytest>=8", "ruff"]

[project.scripts]
myapp = "myapp.cli:main"     # creates a `myapp` command that calls myapp/cli.py:main()

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

```bash
python -m pip install -e ".[dev]"   # install the project (editable) + dev extras
myapp                               # entry point from [project.scripts]
```

## uv (modern alternative)

[uv](https://docs.astral.sh/uv/) is a very fast replacement for pip + venv + pipx + pyenv, driven by `pyproject.toml` and a `uv.lock` lock file.

```bash
# install (or: pipx install uv / winget install astral-sh.uv)
curl -LsSf https://astral.sh/uv/install.sh | sh

uv init myapp && cd myapp     # new project with pyproject.toml
uv add requests               # add dependency (updates pyproject.toml + uv.lock + .venv)
uv add --dev pytest           # dev dependency
uv remove requests
uv sync                       # install exactly what uv.lock says
uv run python app.py          # run inside the project venv
uv lock --upgrade             # upgrade locked versions

uv python install 3.13        # download/manage Python versions
uv pip install requests       # pip-compatible interface (drop-in)
uvx ruff check .              # run a tool in a temporary env (like pipx run)
```

## pipx: CLI tools

[pipx](https://pipx.pypa.io/) installs Python **applications** (black, ruff, httpie, poetry...) each in its own isolated venv and puts their commands on `PATH`. Use it instead of `pip install --user` for tools.

```bash
python -m pip install --user pipx    # or: apt install pipx / brew install pipx / scoop install pipx
pipx ensurepath

pipx install ruff
pipx upgrade-all
pipx list
pipx uninstall ruff
pipx run cowsay "hi"                # run without installing
```
