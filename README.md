# datree.io

## Node.js Module to Integrate with NPM

<a href="./LICENSE">
    <img
      	alt="license:mit"
        src="https://img.shields.io/github/license/datreeio/node-datreeio.svg?style=flat-square"
    />
</a>
<a href="https://www.npmjs.com/packages/datreeio">
	<img
      	alt="node:?"
      	src="https://img.shields.io/badge/node-%3E=4.0-blue.svg?style=flat-square"
    />
</a>
<a href="https://travis-ci.org/datreeio/node-datreeio">
    <img
      	alt="build:?"
      	src="https://img.shields.io/travis/datreeio/node-datreeio/master.svg?style=flat-square"
    />
</a>
<a href="">
	<img
    	alt="coverage:?"
    	src="https://img.shields.io/coveralls/github/datreeio/node-datreeio.svg?style=flat-square"
    />
</a>
 

A Node.js module to help you get useful insights when installing packages/projects with NPM.

:exclamation: We don't currently support Windows OS :exclamation:

## Table Of Contents:
* [Installation](https://github.com/datreeio/node-datreeio#installation)
* [Features](https://github.com/datreeio/node-datreeio#features)
* [Configure](https://github.com/datreeio/node-datreeio#configure)
* [Collected Data](https://github.com/datreeio/node-datreeio#collected-data)
* [About Us](https://github.com/datreeio/node-datreeio#about-us)

## Installation

```bash
$ npm install -g datreeio
```

**If you want to get insights in context with your stack, please sign up at [datree.io](https://app.datree.io) using your Github account.**

## Features

### Version Insight
For every project you install (npm install/i), you will get insights into your dependencies and versions:
* **package.json** - package version in your package.json
* **Latest Version** - package latest version available 
![](https://github.com/datreeio/node-datreeio/blob/master/gif/installProject.gif)

### Alternative Packages Insight
We continuously map the NPM ecosystem and catalog alternative packages. This way, when installing a package (npm install $packageName$), 
you will get insights about optional alternatives (if any), their score and whether the package is currently being used in your dev stack.
* **My Usage** - compared to other alternatives, the percentage of projects in your stack that use this package
* **Score** - packages' final score, based on quality, maintenance, community popularity and internal usage
![](https://github.com/datreeio/node-datreeio/blob/master/gif/installPackage.gif)

## Configure
Our package is built off of NPM's [onload-script](https://docs.npmjs.com/misc/config#onload-script) in order to provide you with continuous insight
with zero effort (there is no need to actively call the package). 
The disadvantage of using onload-script, is that we can't support user interactions like external modules, so the **custom configuration option is not currently available**.

If the project is missing a feature you want or need, let us know - send a feature request:
* Open an [issue](https://github.com/datreeio/node-datreeio/issues) with the 'feat:' prefix in the subject line 
* Provide as much context as you can regarding the issue or what you would like to see in future releases
* Please provide some detail about why existing features and alternative packages won't work for you
* Our project team will prioritize the requested feature or you can [contribute code](https://github.com/datreeio/node-datreeio/blob/master/CONTRIBUTING.md)

## Collected Data
In order to provide a better DX (developer experience), we are collecting user environment details, specifically:
* Installation datetime
* Node.js & binaries versions
* OS platform, release & name
* Uninstall statistics

## About us
[datree](https://www.datree.io) scans, catalogs and recommends code components in the context of your stack. Our platform analyzes and factors in the code components you already use, as well as your organizational technology stack preferences to assist developers.
