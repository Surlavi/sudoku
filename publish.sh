#!/bin/bash

# Stop on the first failure.
set -e

rm -rf dist/* 
npx parcel build index.html --public-url /sudoku/
bash inject_git_revision.sh dist/index.html
npx gh-pages -d ./dist
