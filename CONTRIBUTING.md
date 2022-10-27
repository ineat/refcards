# Contribution

## Repository organization
The repository contains RefCards concerning technologies. There must be one directory per Technology. If needs are different by technology, "sub-directories" must be created first.

The `README.md` lists all the technologies available on the repository. Any new technology must be added there with the link to each of the language files.

## Naming convention

Naming and typography conventions:
***Directories*
* Root directories are written in lowercase
* The directories must contain the versions of the RefCards by language 
**Files**
* The files are named by language `ISO 639-1` en extension `.md`
**README.md**
* The `README.md` must include each technology present
* Technologies must display available languages
* Languages must point to the files in question


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

## Changes Publications 
The contribution must be allong the new branch some repository. 
The branch make change will be reviewed and merged by another contibutor referent on the technology.

## Revues
Don’t forgot that the Refcards they ar part of technology showcase of company. The review it avoided misspelling.

