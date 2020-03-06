# Docker RefCard
*Version française*

RefCard d'utilisation de docker.

## Sommaire

1. [Présentation](#presentation)
2. [Architecture](#architecture)
3. [Docker définitions ](#docker-definitions)
4. [Installer docker](#installer-docker)
5. [Exécuter un conteneur](#executer-un-conteneur)
6. [Récupérer une image depuis un dépôt](#executer-une-image-depuis-un-depot)
7. [Construire une image](#construire-une-image)
8. [Versionner les images](#versionner-les-images)
9. [Déployer une image dans un dépôt](#deployer-une-image-dans-un-depot)
10. [Démarrer, Arrêter un conteneur](#demarrer-arreter-un-conteneur)
11. [Volumes](#volumes)
12. [Réseau](#reseau)
13. [Cheat Sheet](#cheat-sheet)

[Pour aller plus loin](#pour-aller-plus-loin)

14. [Docker Machine](#docker-machine)
15. [Docker Compose](#docker-compose)

## Présentation

Docker est un outil conçu pour faciliter la création, le deploiement et l'exécution d'applications distribuées et cloud native. Il fournit un ensemble d'outils qui permettent aux développeurs de créer des templates appelés images. Ces derniers peuvent être utilisés pour créer des machines virtuelles appelé conteneurs dans lesquels on y inclut les  applications et leurs dépendances.

Docker permet aussi aux organisations d'automatiser leur infrastructure, isoler les applications, maintenir la cohérence et améliorer l'utilisation des ressources.

Docker est une solution open source et disponible gratuitement en version communauté ou en souscrivant une édition entreprise. Il est nativement exécuté dans des environnements Linux du fait de sa genèse mais il fonctionne aussi sous Mac et Windows.

## Architecture

Docker est basé sur l'architecture client-server. Le client communique avec le démon (daemon) docker, qui lui construit, exécute et distribue les conteneurs.

Le démon docker ainsi que le client peuvent cohabiter dans le même système. Dans le cas où ils sont sur des machines différentes, ils comuniquent par API Rest via des sockets UNIX ou une interface réseau.

![](images/architecture.svg)

### Le démon docker

Le démon docker `dockerd` écoute les requêtes de l'API et gère les objets tels que les images, les conteneurs, les réseaux et les volumes.
> Il faut noter qu'un démon peut également communiquer avec d'autres démons pour gérer les services docker.

### Le client docker

Le client `docker` est le premier moyen pour interagir avec Docker. Lorsque l'on exécute des commandes telles `docker run`, le client envoie ces commandes au démon, qui les exécutent.


### Le dépôt (registry) docker

Le registry est un dépôt d'images publiques ou privées. Docker est configuré par defaut pour utiliser docker hub qui est un dépôt publique. 

> Il est possible de créer son propre registry privé dans des plateformes comme `artifactory`, `nexus`.
> La plupart des plateformes cloud on leurs propres registry.
> `Amazon ECR (Elastic Container Registry)` pour AWS, `GCR (Google Container Registry)` pour GCP et `ACR (Azure Container Registry)` pour Azure.


## Docker définitions

**Couche** - Un ensembe de fichiers en lecture seule pour provisionner un system.

**Image** - Un template prêt à l'emploi avec des instructions pour la création d'un conteneur.

**Conteneur** - Une instance d'une image exécuté dans un système.

**Registry** - Un espace de stockage des images.

**Docker machine** - Une machine virtuelle dans laquelle sont exécutés les conteneurs.

**Docker compose** - Un utilitaire qui permet d'exécuter plusieurs conteneurs comme un système.

## Installer docker

## Exécuter un conteneur

## Récupérer une image depuis un dépôt"

## Construire une image

## Versionner les images

## Déployer une image dans un dépôt

## Démarrer, Arrêter un conteneur

## Volumes

## Réseau

## Cheat sheet

#### Télécharger une image
`docker pull image_name`

#### Exécuter et arrêter un conteneur
`docker [start | restart | stop] [container_name | container_full_id | container_startwith_id]`

#### Afficher l'historique d'une image
`docker history [image_name | image_full_id | image_startwith_id]`

#### Créer une image tagguée
`docker tag sourtce_image[:tag] target_image[:tag]`

#### Remove one or multiple images
`docker rmi [...images_names | ...images_ids]`

#### Créer et démarrer un conteneur par la commande run
`docker run -ti --name container_name image_name command`

#### Créer et démarrer un conteneur par la commande run et l'arrêter s'il y a une erreur.
`docker run --rm -ti image_name command`

#### Exécuter une commande dans un conteneur
`docker exec -ti [container_name | container_id] [command.sh | (bash | sh) -c "command"]`

#### Afficher les logs d'un conteneur
`docker logs -ft [container_name | container_id]`

#### Exemple de démarrage d'un conteneur avec exposition de port, montage de volume et mise à jour d'une variable d'environnement
`docker run -it --rm -p 8080:8080 -v /path/to/agent.jar:/agent.jar -e JAVA_OPTS=”-javaagent:/agent.jar” tomcat:9.0.14-jre11`


## Commandes utiles pour nettoyer un système

#### Tuer tous les conteneurs en cours d'exécution
`docker kill $(docker ps -q)`

#### Supprimer tous les conteneurs arrêtés
`docker rm $(docker ps -aq)`

#### Supprimer les images dont le statut est 'dangling'
`docker rmi $(docker images -qf dangling=true)`
