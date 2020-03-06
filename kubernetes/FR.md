# Kubernetes RefCard
*Version française*

RefCard d'utilisation de Kubernetes 1.17

Co-écrit par Germain Lefebvre et Antoine Leteneur.

## Sommaire

1. [Présentation](#présentation)
2. [Architecture](#architecture)
    2. [Master](#master)
        * [API Server](#api-server)
        * [Etcd](#etcd)
        * [Scheduler](#scheduler)
        * [Controller Manager](#controller-manager)
    2. [Worker](#worker)
        * [Kubelet](#kubelet)
        * [Kube Proxy](#kube-proxy)
        * [Conteneurs](#Conteneurs)
    2. [Client](#client)
3. [Principes de fonctionnement](#principes-de-fonctionnement)
3. [Objets Kubernetes](#objets-kubernetes)
    3. [Objets de base](#objets-de-base)
        * [Pod](#pod)
        * [Deployment](#deployment)
        * [Service](#service)
        * [Ingress](#ingress)
    3. [Objets avancés](#objets-avances)
        * [ConfigMap](#configmap)
        * [StatefulSet](#statefulset)
        * [PersistentVolume](#persistenvolume)
        * [PersistentVolumeClaim](#persistenvolumeclaim)
        * [CronJob](#cronjob)
        * [Secret](#secret)
        * [](#)
3. [Cheat Sheet](#cheat-sheet)
    * [Règles & bonnes pratiques](#règles-bonnes-pratiques)
    * [Qui ? Quoi ? Comment ?](#qui--quoi--comment-)
    * [Commandes fréquentes](#commandes-fréquentes)
4. [Débuter avec un projet](#débuter-avec-un-projet)
5. [Configuration minimale](#configuration-minimale)

[Pour aller plus loin](#pour-aller-plus-loin)

10. [Plus de commandes](#plus-de-commandes)
19. [Glossaire](#glossaire)
20. [Références](#références)
21. [L'ours](#lours)

## Présentation
Client > Master > Worker

## Architecture
présentation master>worker
et client>master

### Master
#### API Server
tout est api
rest et json
#### Etcd
base de données
#### Scheduler
#### Controller manager

### Worker
#### Kubelet
#### Kube proxy
#### Conteneurs

### Client
#### Utilisation
kubectl
version identique entre client/server
## Configuration
 ~/.kube/.config

## Principes de fonctionnement

### Objets de base
#### Pod
#### Deployment
#### Service
#### Ingress

### Objets avancés
#### ConfigMap
#### StatefulSet
#### CronJob
#### PersistentVolume
#### PersistentVolumeClaim
#### Secret

## Démarrage facile
**Pod**
get
describe
logs

## Cheat Sheet

## Règles & bonnes pratiques
Voici quelques règles de bonne pratique concernant Kubernetes :
* Utilisez un namespace pour chaque environnement applicatif
* Utilisez le namesapce `default` uniquement si vous avec une seule application
* Créez un Service Account pour chaque Pod/Deployment que vous déployez


## Pour aller plus loin
### Les outils facilitateurs
Cette section rassemble quelques outils qui facilitent la vie autour de Kubernetes.
#### Kubectx
Créé par @ahmetb et disponible sur [https://github.com/ahmetb/kubectx](https://github.com/ahmetb/kubectx), kubectx permet de changer le contexte Kubernetes dans lequel vous travaillez sans devoir vous ré-authentifier sur le cluster. Example avec les clusters `k8s-ineat-prod` et `k8s-ineat-dev`.
```bash
kubectx k8s-ineat-prod
kubectx k8s-ineat-dev
```

#### Kubens
Créé par @ahmetb et disponible sur [https://github.com/ahmetb/kubectx/blob/master/kubens](https://github.com/ahmetb/kubectx/blob/master/kubens), kubens permet de changer de namespace au sein d'un cluster Kubernetes. L'outil permet de ne plus préciser le namespace ciblé dans chacune des commandes exécutées.
```bash
kubectl get pods -n kube-system
kubens kube-system
kubectl get pods         # Génère la même réponse
```

#### Kubee aliases
Créé par @ahmetb et disponible sur [https://github.com/ahmetb/kubectl-aliases](https://github.com/ahmetb/kubectl-aliases), kube aliases permet d'utiliser des raccourcis pour la majorité des commandes de base. Le fichier fournit nécessite d'être sourcé avant de pouvoir utiliser les alias. Exemples d'alias générés :
```bash
kgdep
kgpo -n default
kgpon kube-system
ka deployment.yaml
krm -f deploymen.yaml
krmsvc my-app
```

### Les incontournables de Kubernetes
#### Prometheus
#### Helm

### Les outlis avancés
#### ArgoCD
#### Flux

## Trucs et astuces

## Glossaire
### Terme
*Définition du terme*

## Références

* [Site officiel Kubernetes](https://kubernetes.io)


Ce guide a été écrit par Germain Lefebvre et Antoine Leteneur.

Merci à nos relecteurs : . 

La direction artistique et les illustrations sont l'œuvre de Jean-François Tranchida.
