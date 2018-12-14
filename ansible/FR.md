# Ansible RefCard
*Version française*

RefCard d'utilisation de Ansible.

Ecrit par Germain LEFEBVRE en December 2018 pour Ansible v2.7.

**Sommaire**
1. [Contexte](#context)
1. [Version Ansible à jour](#version-ansible-a-jour)
1. [Définitions des objets](#definitions-des-objets)
1. [Configuration de Ansible](#configuration-de-ansible)
1. [Commandes AdHoc](#commandes-adhoc)
1. [Ansible Inventories](#ansible-inventories)
1. [Ansible Tasks](#ansible-tasks)
1. [Ansible Playbooks](#ansible-playbooks)
1. [Ansible Variables](#ansible-variables)
1. [Ansible Plays](#ansible-plays)
1. [Ansible Roles](#ansible-roles)
1. [Ansible Modules](#ansible-modules)
1. [Ansible Vault](#ansible-vault)

   

### Context
Voici la liste des versions des paquets utilisés pou rréaliser la Refcard.

Distribution et version :
```sh
cat /etc/redhat-release
```
```
CentOS Linux release 7.5.1804 (Core)
```

Version Python:
```sh
python --version
```
```
Python 2.7.5
```

Version Ansible:
```sh
ansible --version
```
```
ansible 2.7.1
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/home/ansible/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /bin/ansible
  python version = 2.7.5 (default, Apr 11 2018, 07:36:10) [GCC 4.8.5 20150623 (Red Hat 4.8.5-28)]
```


## Version Ansible à jour
Ansible dévoile leur Roadmap pour la v2.7 : [https://docs.ansible.com/ansible/2.7/roadmap/ROADMAP_2_7.html](https://docs.ansible.com/ansible/2.7/roadmap/ROADMAP_2_7.html)


Ansible met à dispo des guides de portage pour aider à rester à jour :
* [Ansible 2.0 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.0.html)
* [Ansible 2.3 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.3.html)
* [Ansible 2.4 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.4.html)
* [Ansible 2.5 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.5.html)
* [Ansible 2.6 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.6.html)
* [Ansible 2.7 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.7.html)

## Définitions des objets
### Ansible Facts
The Facts are variables used by Ansible to persist data through hosts and executions. There are native facts are stored on local server (disk or in-memory) and user facts defined by Human actions. It is important to get that facts are stored by group of actions OR by host.
Les Facts sont des variables utilisées par Ansible pour persiter des données entre les machine et leurs exécutions. Chaque machine possède des facts natfs 
### Ansible Hosts
The Hosts are just servers that the Ansible Server can reach trhough its preferred protocol.

### Ansible Inventories
The Inventories are list of Hosts defined by FQDN and tidied in groups. Groups can be composed with hosts or group of hosts. Hosts can be aliased to make the list customisable.

### Ansible Tasks
The Tasks are the actions launched on remote Hosts. Tasks are written in YAML langage in a descriptive structure way making the read and write uniform through any tasks in the world.

### Ansible Variables
The Variables are the way for Ansible to pass custom values in tasks (and more over).

### Ansible Playbooks
The Playbooks are the gathering of tasks and hosts. So a Playbook defines a list of tasks to perform on remote servers.

### Ansible Roles
The Roles are the tidy way to write playbooks. It permits to store a group of actions with the same purpose and to call them in playbooks in a single line.

### Ansible Handlers
Ansible Handlers are action triggers called from tasks and run at the end of a play. A Handler is a tasks defined by its name and called with its name.

### Ansible Modules
Modules are scripts written in Python and making uniform actions possible in giving common inputs for users and generating outputs regarding the command played in the module.


## Ansible Configuration
