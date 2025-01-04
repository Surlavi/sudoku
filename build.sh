#!/bin/bash

# Stop on the first failure.
set -e

cd wasm
wasm-pack build --target web
cd ..
npm run compile
if [ ! -e build/wasm ]; then
  cd build
  ln -s ../wasm .
  cd ..
fi
npx sass scss/:build/
python3 -m http.server 8080
