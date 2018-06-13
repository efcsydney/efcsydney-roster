#!/bin/bash
BASE_DIR=$(dirname "$0")
cd $BASE_DIR/../

yarn

pushd ./client/
yarn
yarn build
popd

echo "Clean up"
if [ -f ./efcsydney-roster.tar.gz ]; then
  rm -rf efcsydney-roster.tar.gz
fi

mv ./client/node_modules ./../
find log/* ! -name '.gitignore' -exec rm -rf {} +

echo "Tar"
pushd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster
mv efcsydney-roster.tar.gz efcsydney-roster/
popd

echo "recover node_modules..."
mv ./../node_modules ./client/node_modules