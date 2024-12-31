rm -rf dist/* && npx parcel build index.html --public-url /sudoku/ && npx gh-pages -d ./dist
