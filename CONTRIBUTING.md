# Contribution

## Repository organization
The repository contains refcards concerning some technologies. One directory must exist by technology. If needs are different by technology, sub-directories must be created first.

The `README.md` lists all the technologies available on the repository. Any new technology must be added there with the link to each of the language files.

## Naming conventions

Naming and typography conventions:
***Directories*
* Root directories are written in lowercase
* The directories must contain the refcard versions, by language 
**Files**
* The files are named by language, according to the `ISO 639-1` spec and the extension must be `.md`
**README.md**
* The `README.md` must include each technology present
* Technologies must display available languages
* Languages must point to the related files


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
The branch make change will be reviewed and merged by an another maintainer of the technology.

## Reviews
Don’t forgot that the refcards are parts of company technology showcase. The review allows to avoid some misspellings for example.

