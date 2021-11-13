#!/usr/bin/env bash

git checkout gh-pages

git rm -r *

git checkout main -- browser
git checkout main -- core
git checkout main -- sample-scenes
