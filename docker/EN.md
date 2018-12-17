# Docker RefCard
*English version*

RefCard for Docker usage.

## Docker definitions

**Layer** - A set of read-only files to provision the system.
**Image** - An ordered collection of root filesystem changes, used to execute code in docker container. May have a parent image.
**Container** - A runnable instance of image.
**Registry** - Central place where images live.
**Docker machine** - A VM to run Docker containers.
**Docker compose** - An utility to run multiple containers as a system.

## Useful commands

Donwload an image
##### `docker pull image_name`

Start and stop container
##### `docker [start | restart | stop] [container_name | container_full_id | container_startwith_id]`

Show history of an image
##### `docker history [image_name | image_full_id | image_startwith_id]`

Create an image tag
##### `docker tag sourtce_image[:tag] target_image[:tag]`

Remove one or multiple images
##### `docker rmi [...images_names | ...images_ids]`

Create and start container, run command
##### `docker run -ti --name container_name image_name command`

Create and start container, run command, destroy container
##### `docker run --rm -ti image_name command`

Run a command in a container
##### `docker exec -ti [container_name | container_id] [command.sh | (bash | sh) -c "command"]`

Follow a container logs
##### `docker logs -ft [container_name | container_id]`

Example filesystem and port mappings
##### `docker run -it --rm -p 8080:8080 -v /path/to/agent.jar:/agent.jar -e JAVA_OPTS=”-javaagent:/agent.jar” tomcat:9.0.14-jre11`


## Useful cleanup commands

Kill all running containers
##### `docker kill $(docker ps -q)`

Remove all stopped containers
##### `docker rm $(docker ps -aq)`

Delete dangling images
##### `docker rmi $(docker images -qf dangling=true)`
