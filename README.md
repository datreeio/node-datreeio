# datree.io

## Node.js Module to integrate with NPM

[![Build Status](https://travis-ci.org/datreeio/node-datreeio.svg?branch=master)](https://travis-ci.org/datreeio/node-datreeio)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/datreeio/node-datreeio/badge.svg?branch=master)](https://coveralls.io/github/datreeio/node-datreeio?branch=master)

A Node.js module to help you get useful insights when installing packages/project with NPM.
The package is based on NPMs' [onload-script](https://docs.npmjs.com/misc/config#onload-script) in order to provide you continues insight
with zero effort (there is no need to actively call the package).

:exclamation: DON'T SUPPORT WIMDOWS OS :exclamation:

## Table Of Contents:
* [Installation](https://github.com/datreeio/node-datreeio#installation)
* [Features](https://github.com/datreeio/node-datreeio#features)
* [Build](https://github.com/datreeio/node-datreeio#build)
* [Tests](https://github.com/datreeio/node-datreeio#tests)
* [Collected data](https://github.com/datreeio/node-datreeio#collected-data)
* [About us](https://github.com/datreeio/node-datreeio#about-us)

## Installation

```bash
$ npm install -g datreeio
```

**If you want to get the insights in contex of your stack, you will need authenticate datree's platform:**
1) Signup with your gitbhub account at [datree.io](https://www.datree.io)
2) Go to [datreeio's package page](https://www.datree.io/pkg/single-package/datreeio)
3) Copy your unique snippet to your favorite termainal

## Features

### smart version insight
for every package.json you will install (npm install / i), you will get insight about your dependencies versions:


### alternative packages insight

## Build

```bash
$ npm run build
```

## Tests

```bash
$ npm test
$ npm run test-html # Generate HTML coverage report
```

## Collected data
in order to provide a better UX, we are also collecting users env details.
we are collecting the following data:
* Installtion datetime
* Node.js & binaries versions
* OS platform, release & name
