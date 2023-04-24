# Linux Survival Guide

**WORK IN PROGRESS**

*Version francaise*

RefCard de survie en environnement Linux

Co-écrit par Lucas Declercq & Paul Delafosse

## Sommaire

1. [Présentation](#Présentation)
1. [Les concepts](#Les concepts)
1. [Cheat Sheet](#Cheat Sheet)
1. [Le shell]()
1. [Les utilitaires indispensables]()
1. [Installation de paquets]()
1. [Travailler avec une machine distante]()
    * [SSH]()
    * [Transfert de fichier]()
1. [Le système de fichiers]()
    * [Architecture]()
    * [Partitionnement]()
1. [Les fichiers]()
    * [Manipulation de fichiers]()
    * [Edition de fichiers]()
1. [Les ressources systèmes]()
1. [Le réseau]()
1. [Les requètes http]()
    * [*cURL*]()
    * [*HTTPie*]()
1. [Gestion des droits]()
    * [Utilisateurs & Groupes]()
    * [Permissions]()
    * [SELinux]()
1. [Les services]()
    * [SysVinit]()
    * [Systemctl]()
1. [Les Logs]()
    * [*tail* & cie]()
    * [*journalctl*]()

## Présentation

## Les concepts

* *Tout est fichier* : 
* PIDs/Process : TBD

## Cheat Sheet

### Les raccourcis

| Combinaison de touches                                  | Action                | 
|---                                      |---                       |
| **Ctrl + E**        | Déplace le curseur en fin de ligne                                |
| **Ctrl + A**        | Déplace le curseur en début de ligne                              | 
| **Alt + Del**       | Supprime un mot                            |
| **Ctrl + Shift + C**| Copie la selection                                     |
| **Ctrl + Shift + V**| Colle le texte dans le buffer                                     |
| **Ctrl + R**        | :heart_eyes: Recherche une commande dans l'historique                 |
| **Alt + L**         | Liste les fichiers du dossier actuel                        |
| **Alt + H**         | Affiche le man de la commande en cours d'édition                          |
| **Ctrl + L**        | Nettoie le terminal                       |
| **Ctrl + X** puis **Ctrl + E**        | :heart_eyes: Ouvre la commande en cours dans l'éditeur par défaut                      |
| **Entrée** puis **~** puis **.** |:heart_eyes:  Quitte une session SSH bloquée|

### Les commandes

