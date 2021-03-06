#!/usr/bin/env bash

set -xe

function test {
 $TRAVIS_BUILD_DIR/node_modules/mocha/bin/mocha --require babel-core/register $TRAVIS_BUILD_DIR/test/integration/$1
}

function install_packages {
  # create project
  rm -rf app
  mkdir app
  cd app
  npm init -y
  npm install --save koa mongoose commander lodash yarn
  
  test $1
  rm -rf ~/.datreeio/test.log
  
  rm -rf node_modules
  npm install

  test $1
  rm -rf ~/.datreeio/test.log

  cd ..
}

function main {
  # Display version
  node --version

  # Build dist
  npm run-script build

  # Install datreeio
  npm install -g

  # Test installation
  test install.test.js

  # Run test cycle with datreeio installed
  install_packages run.test.js

  # Uninstall datreeio
  npm uninstall -g

  # Test uninstallation
  test uninstall.test.js

  # Run test cycle without datreeio
  install_packages norun.test.js

  # Print debug log
  cat ~/.datreeio/debug.log
}

main
