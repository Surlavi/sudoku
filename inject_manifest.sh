#!/bin/bash

filename="$1"

if [ -z "$filename" ]; then
  echo "Usage: $0 <filename>"
  exit 1 # Exit with an error code
fi

if [ ! -f "$filename" ]; then
  echo "Error: File '$filename' not found."
  exit 1
fi

# The prefix part (`/sudoku/`) need to match the actual deployment URL.
sed -i "s/\"start_url\":\"..\/index.html\"/\"start_url\":\"\/sudoku\/index.html\"/" $filename
