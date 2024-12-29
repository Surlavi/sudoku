cd wasm
wasm-pack build --target web
cd ..
npm run compile
python3 -m http.server 8080
