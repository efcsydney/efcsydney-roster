  #!/bin/bash -x
  
  cd /opt/efcsydney-roster/
  yarn

  pushd /opt/efcsydney-roster/client/
  yarn
  popd
  
  echo "Clean up"
  rm -rf efcsydney-roster.tar.gz
  rm -rf client/node_modules
  find log/* ! -name '.gitignore' -exec rm -rf {} +

  echo "Tar"
  pushd ../
  tar -czf efcsydney-roster.tar.gz efcsydney-roster
  mv efcsydney-roster.tar.gz efcsydney-roster/
  popd