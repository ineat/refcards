[//]: # (main: #fef2e1)
[//]: # (second: #2e4995)
[//]: # (third: #2e2b77)


# Ansible RefCard
*English version*

RefCard for Ansible usage.

Written by Germain LEFEBVRE on December 2018 for Ansible v2.7 usage.


**Table of Contents**
1. [Context](#context)
1. [Upgrade your Ansible version](#upgrade-your-ansible-version)
1. [Ansible Definitions](#ansible-definitions)
1. [Ansible Configuration](#ansible-configuration)
1. [Ansible AdHoc Commands](#ansible-adhoc-commands)
1. [Ansible Inventories](#ansible-inventories)
1. [Ansible Tasks](#ansible-tasks)
1. [Ansible Playbooks](#ansible-playbooks)
1. [Ansible Variables](#ansible-variables)
1. [Ansible Plays](#ansible-plays)
1. [Ansible Roles](#ansible-roles)
1. [Ansible Modules](#ansible-modules)
1. [Ansible Vault](#ansible-vault)



### Context


This is the list of the packages version used to make this RefCard.

Operating System distribution and version:
```sh
cat /etc/redhat-release
```
```
CentOS Linux release 7.5.1804 (Core)
```

Python version:
```sh
python --version
```
```
Python 2.7.5
```

Ansible version:
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


## Upgrade your Ansible version
Ansible give their Roadmap for v2.7 : [https://docs.ansible.com/ansible/2.7/roadmap/ROADMAP_2_7.html](https://docs.ansible.com/ansible/2.7/roadmap/ROADMAP_2_7.html)


Ansible provides porting guides to help you keeping up-to-date:
* [Ansible 2.0 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.0.html)
* [Ansible 2.3 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.3.html)
* [Ansible 2.4 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.4.html)
* [Ansible 2.5 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.5.html)
* [Ansible 2.6 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.6.html)
* [Ansible 2.7 Porting Guide](https://docs.ansible.com/ansible/2.7/porting_guides/porting_guide_2.7.html)

## Ansible Definitions
### Ansible Facts
The Facts are variables used by Ansible to persist data through hosts and executions. There are native facts are stored on local server (disk or in-memory) and user facts defined by Human actions. It is important to get that facts are stored by group of actions OR by host.

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
Configuration can be made and used in a file which will be searched for in the following order:
* ansible.cfg (in the current directory)
* ~/.ansible.cfg (in the home directory)
* /etc/ansible/ansible.cfg


## Ansible AdHoc Commands
AdHoc commands are commands launched on the fly with writting any complex structured files.

```sh
ansible localhost -m ping
ansible localhost -m setup
ansible localhost -m debug -a 'myVar'
ansible localhost -m shell -a 'uptime'
ansible all -i inventories/servers -m ping
```

## Ansible Inventories
Ansible Inventories make possible to gather servers in a single file to run commands on all these hosts. Inventories are usually organized by environments (a file by env) to let the group_vars operate on tasks and roles.

Inventory definition:
```yaml
server.domain.fr
server[01-09].domain.fr

rhel01 rhel01.domain.fr
deb01 deb01.domain.fr
arch01 arch01.domain.fr
win01 win01.domain.fr

[redhat]
rhel01

[debian]
deb01

[linux:children]
redhat
debian

[linux]
arch01

[windows]
win01
```


## Ansible Tasks
A task is a YAML structure able to perform actions through Ansible.

Task definition :
```yaml
- name: The task name to make things clearly
  become: yes
  become_method: sudo
  become_user: root
  check_mode: yes
  diff: no
  remote_user: ansible
  ignore_errors: True
  import_tasks: more_handlers
  include_tasks: other-tasks.yml
  notify: restart apache
  register: my_register
  changed_when: False
  failed_when: False
  vars:
    - myvar: toto
    myfiles:
      -  default.conf
  loop:
    - item1
    - ["item2", "item3"]
    - { name: "item4", description: "Desc Item 4" }
  when:
    - my_register is defined
    - ansible_distribution == "CentOS"
    - ansible_distribution_major_version == "7" 
  block:
    - name: Task to run in block
      ...
  rescue:
    - name: Task when block failed
  always:
    - name: Task always run before/after block
```


## Ansible Playbooks
A playbook is the gathering between hosts where will be applied tasks.

**Install package on RHEL servers**
```yaml
- hosts: [redhat]
  become: true
  tasks
  - yum:
      name: httpd
      state: installed
```

**Run roles on Docker servers but Master**
```yaml
- hosts: docker,!docker-master
  become: true
  roles:
  - docker
  - kubernetes
```


## Ansible Variables
### Variable Definition

A Ansible variable is defined in *group_vars*, *host_vars*, *role vars*, *CLI vars* and is called in Jinja Templating way : `{{ my_variable }}`. You can call variables everywhere in Ansible (tasks, variables, template, ...)

### Variable Typology

You can have 3 types of variables:
* String
* List
* Dictionary

A variable is defined by a couple Key/Value where Key doesn't have any space and Value is a structure as defined above.
```yaml
my_string: "value"
my_list: ["bob", "alice"]
my_dict:
    item1: value1
    item2: value2
```

### Variable precedence
You can set Ansible variables in multiple places like `group_vars`, `playbooks`, `roles`, etc... but they are evaluated according to a precedence. Here is the order of precedence from least to greatest:
```
command line values
role defaults
inventory file or script group vars
inventory group_vars/all
playbook group_vars/all
inventory group_vars/*
playbook group_vars/*
inventory file or script host vars
inventory host_vars/*
playbook host_vars/*
host facts / cached set_facts
play vars
play vars_prompt
play vars_files
role vars (defined in role/vars/main.yml)
block vars (only for tasks in block)
task vars (only for the task)
include_vars
set_facts / registered vars
role (and include_role) params
include params
extra vars (always win precedence)
```


## Ansible Plays
A sufficient list of attributes for Ansible Play when running a playbook:
```yaml
- hosts: webservers
  accelerate: no
  accelerate_port: 5099
  ansible_connection: local
  any_errors_fatal: True
  become: yes
  become_method: su
  become_user: postgress
  become_flags: True
  debugger: on_failed
  gather_facts: no
  max_fail_percentage: 30
  order: sorted
  remote_user: root
  serial: 5
  strategy: debug
  vars:
    http_port: 80
  vars_files:
    - "vars.yml"
  vars_prompt:
    - name: "my_password2"
      prompt: "Enter password2"
      default: "secret"
      private: yes
      encrypt: "md5_crypt"
      confirm: yes
      salt: 1234
      salt_size: 8
  tags: 
    - stuff
  pre_tasks:
    - <task>
  roles:
    - common
    - common
      vars:
        port: 5000
      when: "bar == 'Baz'"
      tags : [one, two]
    - common
    - { role: common, port: 5000, when: "bar == 'Baz'", tags :[one, two] }
  tasks:
    - include: tasks.yaml
    - include: tasks.yaml
      when: day == 'Thursday'
      vars:
        foo: aaa 
        baz:
          - z
          - y
    - { include: tasks.yaml, foo: zzz, baz: [a,b]}
    - <task>
  post_tasks:
    - <task>
```


## Ansible Roles
### Structure of a role
Role directories strucutre:
```
roles/
└── my-role
    ├── defaults
    │   └── main.yml
    ├── files
    |   └── file
    ├── handlers
    │   └── main.yml
    ├── tasks
    │   └── main.yml
    ├── templates
    |   └── template.j2
    └── vars
        └── main.yml
```

These are what files refer to:
* `my-role/defaults/main.yml` defines default variables for the role,
* `my-role/files/file` file (without vars) to be copied,
* `my-role/handlers/main.yml` defnies the handlers tasks,
* `my-role/tasks/main.yml` is the main taskfile run thorugh the role,
* `my-role/templates/template.yml.j2` template (with vars) to be copied,
* `my-role/vars/main.yml` defines the vars to override,


#### Role with simple task
```yaml
- command: cat /etc/hosts
```

#### Role with file to copy
File at `roles/example/files/my-file.sh` and task at `roles/example/tasks/main.yml`.
```yaml
- copy:
    src: my-file.sh
    dest: /tmp/my-file.sh
```

#### Role with template to generate
Template at `roles/example/templates/my-template.sh.j2`
```sh
#!/bin/bash
echo "{{ timezone }}"
```

Task at `roles/example/tasks/main.yml`
```yaml
- template:
    src: my-template.sh.j2
    dest: /tmp/my-template.sh
```

#### Role with trigger to handler
Handler at `roles/example/handlers/main.yml`.
```yaml
- name: Restart Apache
  systemd:
    name: httpd
    state: restart
```

Task at `roles/example/tasks/main.yml`.
```yaml
- copy:
    src: httpd.conf
    dest: /etc/httpd/conf/httpd.conf
  notify: Restart Apache
```
Will run the handler `Restart Apache` if task `copy` state has changed.

#### Role with default variables
Default variables at `roles/example/defaults/main.yml`
```yaml
apache_version: '2.4.2'
```

Task at `roles/example/tasks/main.yml`
```yaml
- yum:
    name: httpd-{{ apache_version }}
    state: present
```


## Including and importing playbooks or tasks or roles
### Include tasks
Both `import_task` and `include_task` work.
```yaml
- hosts: [redhat]
  tasks:
  - import_tasks: roles/example/tasks/main.yml
  - include_tasks: roles/example/tasks/main.yml
```

### Include tasks but filter on tag in ansible-playbook command
Only `import_tasks` works and evaluates tags from tasks.

### Include playbook
Only `import_playbook` works for including a whole playbook in another one.
```yaml
- import_playbook: install_apache.yml
```

### Include a whole role
Both `import_role` and `include_role` can be used to call tasks from a role. This will include the whole role `example`.
```yaml
- hosts: [redhat]
  tasks:
  - import_role:
      name: example
```

### Include a taskfile from a role
Permit to load all variables inherant to the role. This will include the task `install.yml`from the role `example`.
```yaml
- hosts: [redhat]
  tasks:
  - include_role:
      name: example
      tasks_from: install
```

### Include tasks but filter on tag in ansible-playbook command
Only `import_role` works for including a whole role in a playbook using tags on commands.
```yaml
- hosts: [redhat]
  tasks:
  - import_role:
      name: example
```

## Ansible Options
Ansible offre des possibilités plus avancées qui aident à la vérification, au débuggage et poussent sur le plan non destructif des exécutions.

### Filter with Inventory
Option `--limit` or `-l` filters playbook runtime by server (host or alias), inventory groups and understand the exclusions.
```
ansible-playbook -i hosts.yml playbook.yml --limit 'linux,!debian'
```

### Filter by Tag
Option `--tag` or `-t` filters playbook tasks on tags set through attribut `tags:` on Plays and Tasks. Exclusion is possible on Tag filter.
```
ansible-playbook -i host.yml playbook.yml --tags 'config,service,!reload'
```

### Run in Dry-Run
Option `--check` runs playbook without applying any modification on server and reveals the state for every Task (ok, changed, failed). Dry-Run mode make verifications easy.
```
ansible-playbook -i host.yml playbook.yml --check
```
Dry-Run mode is not plenty compatible with shell module because no state is returned on running shell scripts or commands.

### Mode Differences
Option `--diff` show differences between Ansible and Server sides and is closely linked to files (copy, template modules). Differences mode is a good way to see changes on servers.
```
ansible-playbook -i host.yml playbook.yml --diff
```

## Ansible Modules
### Location
Store your modules on :
* Local side (current dir) : Create your Ansibel Module directly in your ansible rundir in a directory `library`,
* Server side (all users) : Define the path with the attribute `library` in `/etc/ansible/ansible.cfg`.
```ini
library        = /usr/share/my_modules/
```

### Instanciate your Module Class
```python
class MyAnsibleModule(AnsibleModule):
    def __init__(self, *args, **kwargs):
        self._output = []
        self._facts = dict()
        super(MyAnsibleModule, self).__init__(*args, **kwargs)

    def process(self):
        [...]
```

### Run your Class
```python
if __name__ == '__main__':
  MyAnsibleModule().process()
```


### Define your attributes

Define your module arguments.
```python
MyAnsibleModule(
    argument_spec=dict(
        url=dict(type='str',
                 required=True),
        type=dict(type='str',
                  required=True,
                  choices=['indice', 'document']),
        state=dict(type='str',
                   choices=['present','absent'],
                   default='present')
    )
).process()
```

Call your module argument on processing.
```python
def process(self):
    try:
        changed = False

        # Retrieve value for attribute 'url'
        param_url = self.params['url']

        self.exit_json(changed=changed, ansible_facts={}, output=self._output)
    except Exception as e:
        self.fail_json(msg=(e.message, self._output))
```

### Use the Check Mode
Enable the check mode.
```python
def main():
    MyAnsibleModule(
        supports_check_mode=True,
        [...]
    ).process()
```

Use the check mode in processing. Process to your action after checking check_mode statement.
```python
def process(self):
    # Stop if check_mode is true before doing any action
    if self.check_mode:
        return True
    # Keep doing actions if check_mode is false
```

## Ansible Vault

### Vault Configuration

Ansible Vault Password configuration can be done in several ways:
* Attribute `vault_password_file` in file `ansible.cfg`,
* Env variable `ANSIBLE_VAULT_PASSWORD_FILE`,
* Option `--vault-password-file` or `--vault-id` with password file in ansible command,
* Option `--ask-vault-pass` with prompt in ansible command.


### Vault File
You can secure whole files with vault in encrypting them.
```
ansible-vault create foo.yml
ansible-vault encrypt foo.yml
```

View and decrypt to clear file.
```
ansible-vault view foo.yml
ansible-vault encrypt foo.yml
```

### Vault Variables
You can also only encrypt value in variables files.
```
ansible-vault encrypt_string --name 'mykey' 'mysecret'
```

### Ansible with Vault
If you have provided a vault password in configuration file then you will keep using ansible as usual.
```
```

If not you will need to provide vault options to your ansible commands.
```
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
ansible-playbook --vault-id dev@dfile-dev-password site.yml
ansible-playbook --vault-id prod@prompt site.yml
```

You can also provide multiple vault resolvers to roll on multiple environments. Example for Dev with password file and Prod with prompt.
```
ansible-playbook --vault-id dev@dev-password --vault-id prod@prompt site.yml
```

