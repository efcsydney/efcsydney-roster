#!/bin/sh -x

echo "Clean up"
rm -rf efcsydney-roster.tar.gz
rm -rf client/node_modules
find log/* ! -name '.gitignore' -exec rm -rf {} +

echo "Tar"
pushd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster
mv efcsydney-roster.tar.gz efcsydney-roster/
popd

echo "Build Docker Image"
docker-compose -f compose.yml build
docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")
