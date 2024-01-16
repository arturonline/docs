# Docker Compose

When using Docker extensively, the management of several different containers quickly becomes cumbersome.

Docker Compose is a tool that helps us overcome this problem and easily handle multiple containers at once.

## Dockerfiles

n short, Docker Compose works by applying many rules declared within a single _docker-compose.yml configuration file_.

These YAML rules, both human-readable and machine-optimized, provide us an effective way to snapshot the whole project from ten-thousand feet in a few lines.

Almost every rule replaces a specific _Docker_ command so that in the end we just need to run:

```sh
> docker-compose up
```

## Compose

Using Compose is basically a three-step process:

1. Define your app’s environment with a Dockerfile so it can be reproduced anywhere.
1. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.
1. Run `docker-compose up` and Compose starts and runs your entire app.

## The YAML Configuration Explained

A `docker-compose.yml` looks like this:

```yaml
version: "3"
services:
  # This section defines all the different containers we will create. In our example, we have two services, web and database.
  web:
    # Path to dockerfile.
    # '.' represents the current directory
    build: .

    # Mapping of container port to host
    ports:
      - "5000:5000"
    # Mount volume
    volumes:
      - "/usercode/:/code"

    # Links: This will link one service to another. For the bridge network, we must specify which container should be accessible to which container using links.
    links:
      - "database:backenddb"

  database:
    # image to fetch from docker hub
    image: mysql/mysql-server:5.7

    # Environment variables for startup script
    # container will use these variables
    # to start the container with these define variables.
    environment:
      - "MYSQL_ROOT_PASSWORD=root"
      - "MYSQL_USER=root"
      - "MYSQL_PASSWORD=root"
      - "MYSQL_DATABASE=db"
    # Mount init.sql file to automatically run
    # and create tables for us.
    # everything in docker-entrypoint-initdb.d folder
    # is executed as soon as container is up nd running.
    volumes:
      - "/usercode/db/init.sql:/docker-entrypoint-initdb.d/init.sql"
```

## Docker Compose commands

```sh
$ docker-compose --help
# Define and run multi-container applications with Docker.

$ docker-compose build
# This command builds images in the docker-compose.yml file. The job of the build command is to get the images ready to create containers, so if a service is using the prebuilt image, it will skip this service.

$ docker-compose images
# This command will list the images you’ve built using the current docker-compose file.

$ docker-compose run
# This is similar to the docker run command. It will create containers from images built for the services mentioned in the compose file.

$ docker-compose up
# This command does the work of the docker-compose build and docker-compose run commands. It builds the images if they are not located locally and starts the containers. If images are already built, it will fork the container directly.

$ docker-compose start
# After the first time, however, we can simply use start to start the services.

$ docker-compose down
#  This command is similar to the docker system prune command. However, in Compose, it stops all the services and cleans up the containers, networks, and images.

$ docker-compose stop:
#This command stops the running containers of specified services.

$ docker-compose ps
# This command list all the containers in the current docker-compose file. They can then either be running or stopped.
```
