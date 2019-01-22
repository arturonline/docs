# URLSessions

URLSession class provide an API for downloading content. With the URLSession API, your app creates one or more sessions, each of which coordinates a group of related data transfer tasks. URLSession has a singleton shared session (which has no configuration object) for basic requests. It’s not as customizable as sessions you create, but it serves as a good starting point if you have very limited requirements.

For other kinds of sessions, you instantiate a URLSession with one of three kinds of configurations:

- A default session behaves much like the shared session, but allows more configuration, and allows you to obtain data incrementally with a delegate.

- Ephemeral sessions are similar to shared sessions, but don’t write caches, cookies, or credentials to disk.

- Background sessions let you perform uploads and downloads of content in the background while your app isn't running.

## Types of URL Session Tasks

Within a session, you create tasks that optionally upload data to a server and then retrieve data from the server either as a file on disk or as one or more NSData objects in memory. The URLSession API provides three types of tasks:

- Data tasks send and receive data using NSData objects. Data tasks are intended for short, often interactive requests to a server.

- Upload tasks are similar to data tasks, but they also send data (often in the form of a file), and support background uploads while the app isn’t running.

- Download tasks retrieve data in the form of a file, and support background downloads and uploads while the app isn’t running.
