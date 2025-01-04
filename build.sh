#!/bin/bash

# Stop on the first failure.
set -e

cd wasm
wasm-pack build --target web
cd ..
npm run compile
cd build
ln -s ../wasm .
cd ..
npx sass scss/:build/
python3 -m http.server 8080
