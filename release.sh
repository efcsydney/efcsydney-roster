#!/bin/bash
BASE_DIR=$(dirname "$0")
echo $BASE_DIR
#cd /opt/efcsydney-roster/
cd $BASE_DIR
yarn

pushd $BASE_DIR/client/
yarn
yarn build
popd

echo "Clean up"
if [ -f ./efcsydney-roster.tar.gz ]; then
  rm -rf efcsydney-roster.tar.gz
fi

rm -rf client/node_modules
find log/* ! -name '.gitignore' -exec rm -rf {} +

echo "Tar"
pushd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster
mv efcsydney-roster.tar.gz efcsydney-roster/
popd