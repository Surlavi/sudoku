#!/bin/bash

# Stop on the first failure.
set -e

cd wasm
wasm-pack build --target web
cd ..
npm run compile
npx sass scss/:build/
python3 -m http.server 8080
