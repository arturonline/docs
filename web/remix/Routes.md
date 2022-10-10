# Routes

```sh
app/
├── routes/
│   ├── blog/
│   │   ├── $postId.tsx
│   │   ├── categories.tsx
│   │   ├── index.tsx
│   └── about.tsx
│   └── index.tsx
└── root.tsx
```

```sh 
| URL              | Matched Route                  |
| ---------------- | ------------------------------ |
| /                | app/routes/index.tsx           |
| /blog            | app/routes/blog/index.tsx      |
| /blog/categories | app/routes/blog/categories.tsx |
| /blog/my-post    | app/routes/blog/$postId.tsx    |

```

Routes that begin with a `$` character indicate the name of a dynamic segment of the URL. It will be parsed and passed to your loader and action data as a value on the param object.

For example: 

>app/routes/blog/$postId.tsx 

will match the following URLs:

* `/blog/my-story`
* `/blog/once-upon-a-time`
* `/blog/how-to-ride-a-bike`
