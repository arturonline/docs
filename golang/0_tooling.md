# Tooling

> [Install the Go tools](https://golang.org/doc/install)

## Create a project

Create a folder, and inside that folder:

```bash
    go mod init github.com/arturonline/name
```

## Building Code

```bash
    go build
```

```bash
    go build some_name
```

## Running Code

```bash
    go run
```

## Fetching Dependecies

```bash
    go get github.com/foo/bar@8e1b8d3
```

## Formatting Code

```bash
    gofmt
    go fmt

  gofmt -w -s -d foo.go  # Format the foo.go file
```

## Upgrading to a new Go release

```bash
    go fix ./..
```

## Documentation

You can view documentation for the standard library packages via your terminal using the go doc tool. I often use this during development to quickly check something — like the name or signature of a specific function. I find it faster than navigating the web-based documentation and it's always available offline too.

```bash
    go doc strings            # View simplified documentation for the strings package
    go doc -all strings       # View full documentation for the strings package
    go doc strings.Replace    # View documentation for the strings.Replace function
    go doc sql.DB             # View documentation for the database/sql.DB type
    go doc sql.DB.Query       # View documentation for the database/sql.DB.Query method
```

You can also include the -src flag to display the relevant Go source code. For example:

```bash
    go doc -src strings.Replace
```
