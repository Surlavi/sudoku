BUILD_VERSION=$(git rev-parse --short HEAD 2>/dev/null)
if [[ -z "$BUILD_VERSION" ]]; then
  exit 1
fi

BUILD_VERSION="$(date +%Y%m%d)-$BUILD_VERSION"

filename="$1"

if [ -z "$filename" ]; then
  echo "Usage: $0 <filename>"
  exit 1 # Exit with an error code
fi

if [ ! -f "$filename" ]; then
  echo "Error: File '$filename' not found."
  exit 1
fi

sed -i "s/BUILD_VERSION: dev/BUILD: $BUILD_VERSION/" $filename
