# datree.io

## Node.js Module to integrate with NPM

[![Build Status](https://travis-ci.org/datreeio/node-datreeio.svg?branch=master)](https://travis-ci.org/datreeio/node-datreeio)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/datreeio/node-datreeio/badge.svg?branch=master)](https://coveralls.io/github/datreeio/node-datreeio?branch=master)

A Node.js module to help you get useful insights when installing packages/project with NPM.

:exclamation: DON'T SUPPORT WINDOWS OS :exclamation:

## Table Of Contents:
* [Installation](https://github.com/datreeio/node-datreeio#installation)
* [Features](https://github.com/datreeio/node-datreeio#features)
* [Configure](https://github.com/datreeio/node-datreeio#configure)
* [Collected Data](https://github.com/datreeio/node-datreeio#collected-data)
* [About us](https://github.com/datreeio/node-datreeio#about-us)

## Installation

```bash
$ npm install -g datreeio
```

**If you want to get the insights in context of your stack, you will need to authenticate datree's app by sign-up with your GitHub account at [datree.io](https://www.datree.io)**

## Features

### Smart Version Insight
For every package.json you will install (npm install / i), you will get insight about your dependencies versions:
* **package.json** - package version in your package.json
* **Smart Version** - recommended version of package for you to use, even if it's not the latest - based on public usage ("crowd wisdom")
* **Latest Version** - package latest version available 

### Alternative Packages Insight
We are constantly mapping the NPM ecosystem and cataloging alternative packages. This way, when installing a package (npm install %packageName%), 
you will get insights about optional alternatives (if there are any), their score and if the package already used in your stack.
* **Smart Version** - recommended version of package for you to use, even if it's not the latest - based on public usage ("crowd wisdom")
* **My Usage** - compared to the other alternatives, the percentage of projects in your stack that use this package
* **Score** - package's final score, based on quality, maintenance, popularity and internal usage

## Configure
We decided to base our package on NPM's [onload-script](https://docs.npmjs.com/misc/config#onload-script) in order to provide you continuous insight
with zero effort (there is no need to actively call the package). 
The disadvantage of using onload-script, is that we can't support user interaction like external module, so **custom configuration option is not available (for now)**.

If the project doesn't do something you need or want it to do - feel free to fill a feature request:
* Open an [issue](https://github.com/datreeio/node-datreeio/issues) with 'feat:' prefix in the subject line 
* Provide as much context as you can about what you're running into
* Please try and be clear about why existing features and alternatives would not work for you
* The project team will prioritize the requested feature or you can [contribute code](https://github.com/datreeio/node-datreeio/blob/master/CONTRIBUTING.md)

## Collected Data
In order to provide a better DX (developer experience), we are also collecting users env details.
we are collecting the following data:
* Installation datetime
* Node.js & binaries versions
* OS platform, release & name
* Uninstall statistics

## About us
datree scans, catalogs and recommends code components in the context of your stack. Our platform analyzes and factors in the code components you already use, as well as your organizational technology stack preferences to assist developers.