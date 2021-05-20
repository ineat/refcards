# Contribution

## Oganisation du repository
Le repository comporte les RefCards concernant des technologies. Il doit exister un répertoire par Technologie. Si des besoins sont différents par technologie, des sous-répertoires au premier doivent petre créés.

Le `README.md` liste toutes les technologies disponibles sur le repository. toute nouvelle technologie doit y être ajoutée avec le lien vers chacun des fichier de langue.

## Convention de nommage

Les conventions de nommages et de typographie :
***Répertoires*
* Les répertoires à la racines sont écrits en minuscules
* Les réperotires doivent comporter les versions des RefCards par langue
**Fichiers**
* Les fichiers sont nommés par langue dans le format `ISO 639-1` en extension `.md`
**README.md**
* Le `README.md` doit comporter chaque technologie présente
* Les technologies doivent afficher les langues disponibles
* Les langues doivent pointer vers les fichiers en question


Example :
```
refcards
├── ansible
│   ├── EN.md
│   └── FR.md
├── technologie
│   └── sous-technologie
│       ├── EN.md
│       └── FR.md
└── etc...
```

## Publication des modifications
La contribution doit passer par une nouvelle branche du repository.
La branche comportant les modifications sera revue et mergée par un autre collaborateur référent sur la technologie.

## Revue du contenu
N'oubliez pas que les RefCards font parti de la vitrine technologie de la société. La revue du contenu permet d'éviter les fautes d'orthographe et de grammaire.

## Convention ajout d'une Refcard

Si vous souhaitez ajouter une Refcard, il faudra ajouter au debut de votre fichier Markdown une ligne contenant les couleurs spécifiques (au format hexadecimal) à votre Refcard pour la génération HTML.

Elle devra être comme ceci : 
```
[//]: # (main: #000000)
[//]: # (second: #111111)
[//]: # (third: #222222)
```

