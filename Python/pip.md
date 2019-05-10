# pip

You can install, upgrade, and remove packages using a program called **pip**. By default pip will install packages from the Python Package Index, <https://pypi.org>.

## Commands

```python
python -m pip search XXX
python -m pip show XXX
python -m pip list

python -m pip install XXX
python -m pip install --upgrade XXX
python -m pip install XXX==1.0.4    # specific version
python -m pip install XXX>=1.0.4    # minimum version
python -m pip uninstall XXX
```

## freeze

`pip freeze` will produce a similar list of the installed packages, but the output uses the format that pip install expects. A common convention is to put this list in a requirements.txt file:

```python
pip freeze > requirements.txt
```

The `requirements.txt` can then be committed to version control and shipped as part of an application. Users can then install all the necessary packages with `install -r`:

```python
pip install -r requirements.txt
```