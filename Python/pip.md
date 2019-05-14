# pip

**pip** is a package manager for Python, used by many projects to manage dependencies.

## Installing with `get-pip.py`

To install pip, securely download `get-pip.py`:

```bash
> curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

> python get-pip.py
```

## Commands

```python
pip help
pip search XXX YYY
pip show XXX
pip list

pip install XXX
pip install --upgrade XXX
pip install XXX==1.0.4    # specific version
pip install XXX>=1.0.4    # minimum version
pip uninstall XXX
```

## `freeze`

`pip freeze` will produce a similar list of the installed packages, but the output uses the format that pip install expects. A common convention is to put this list in a requirements.txt file:

```python
pip freeze > requirements.txt
```

The `requirements.txt` can then be committed to version control and shipped as part of an application. Users can then install all the necessary packages with `install -r`:

```python
pip install -r requirements.txt
```