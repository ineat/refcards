
# Docker RefCard
*Version française*

RefCard d'utilisation de docker.

## Docker définitions

**Couche** - Un ensembe de fichiers en lecture seule pour provisionner un system.

**Image** - Un template prêt à l'emploi avec des instructions pour la création d'un conteneur.

**Conteneur** - Une instance d'une image exécuté dans un système.

**Registry** - Un espace de stockage des images.

**Docker machine** - Une machine virtuelle dans laquelle sont exécutés les conteneurs.

**Docker compose** - Un utilitaire qui permet d'exécuter plusieurs conteneurs comme un système.

## Commandes utiles

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
