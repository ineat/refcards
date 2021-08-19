#!/usr/bin/env bash

# Environment
BUILD_DIR="generator/public"
RELEASE_BRANCH="gh-pages"
VERSION="$(jq -r ".version" generator/package.json)"

# Script
git fetch origin $RELEASE_BRANCH
git add -f $BUILD_DIR
tree=$(git write-tree --prefix=$BUILD_DIR)
git reset -- $BUILD_DIR
identifier=$(git describe --dirty --always)
commit=$(git commit-tree -p refs/remotes/origin/$RELEASE_BRANCH -m "Deploy $identifier with generator v$VERSION"  -m "See $identifier" $tree)
git update-ref refs/heads/$RELEASE_BRANCH $commit
#git tag -a "v$VERSION" -m "Release tag for $VERSION" $commit
git push origin refs/heads/$RELEASE_BRANCH