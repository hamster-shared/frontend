
<div align=center>
<img src="./doc/logo-300.png" width=300" height="300" />
</div>
<div align=center>
<img src="https://img.shields.io/badge/vue-2.6.14-blue"/>
<img src="https://img.shields.io/badge/@polkadot/api-6.10.3-lightBlue"/>
<img src="https://img.shields.io/badge/vue--vben--admin-2.8.0-brightgreen"/>
<img src="https://img.shields.io/badge/ant--design--vue-1.7.7-red"/>
</div>

[github](https://github.com/hamster-shared/frontend): https://github.com/hamster-shared/frontend

hamster is a blockchain-based blockchain infrastructure service. Any computing device can easily access the Hamster network.
# Project Guidelines

## 1. Basic Introduction

### 1.1 Project Introduction

frontend is the web UI of hamster-shared,it is based on [vue](https://cn.vuejs.org)  and uses [Ant Design Vue UI](https://www.antdv.com/docs/vue/introduce-cn) framework, it can interact with hamster chain nodes.

### 1.2 Contributing Guide

Hi! Thank you for choosing Hamster.

Hamster is a blockchain that providers infrastructure service.

We are excited that you are interested in contributing to Hamster. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.



#### 1.2.1 Issue Guidelines

- Issues are exclusively for bug reports, feature requests and design-related topics. Other questions may be closed directly.

- Before submitting an issue, please check if similar problems have already been issued.

#### 1.2.2 Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.

- Commit info should be formatted as `[File Name]: Info about commit.` (e.g. `README.md: Fix xxx bug`)

- If your PR fixes a bug, please provide a description about the related bug.

- Merging a PR takes two maintainers: one approves the changes after reviewing, and then the other reviews and merges.

### 1.3 Version list

- main: 1.0.0 code, for prod
- develop: 2.0.0 dev code, for test


## 2. Getting started

```
- node version    14.16.1
- npm  version    6.14.12
- yarn version >= 1.22.10 
```

### 2.1 Project setup and startup

With yarn or npm

- Install dependencies
```bash
yarn install
      or 
npm install
```
- Compiles and hot-reloads for development

```bash
yarn serve
  or 
npm run serve  
```

- Compiles and minifies for production

```bash
yarn run build
    or
npm run build    
```
- Lints and fixes files
```bash
yarn run lint
  or
npm run lint  
```
- Customize Vue configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 3. Technical selection
- Frontend: using [Vue](https://cn.vuejs.org) based on [Ant Design Vue](https://www.antdv.com/docs/vue/introduce-cn) ，to code the page.

## 4.Project Structure

```bash
├── babel.config.js                                            # babel-loader configuration
├── default.conf                                               # nginx configuration file
├── Dockerfile                                                 # Dockerfile configuration file
├── LICENSE                                                    # Apache License
├── package.json                                               # package.json dependencies
├── public                                                     # static resources
│   ├── favicon.ico                                      # favicon icon
│   ├── images                                           # images
│   │   ├── logo-ct-black.png                      # logo icon on black background
│   │   └── logo-ct-white.png                      # logo icon on white background
│   └── index.html                                       # html template
├── src                                                        # source code
│   ├── api                                              # all requests
│   │   ├── index.js                               # polkadot api
│   │   └── types.js                               # polkadot types
│   ├── App.vue                                          # entry page
│   ├── common                                           # Internationalized language configuration
│   ├── components                                       # global component
│   ├── layouts                                          # global layout
│   ├── main.js                                          # entry file
│   ├── plugins                                          # plugins
│   ├── router                                           # routing configuration
│   ├── scss                                             # global style
│   ├── store                                            # global vuex store
│   ├── utils                                            # global method
│   └── views                                            # all pages
└── vue.config.js                                              # vue-cli configuration

```

## 5.Functions
frontend mainly includes the following functions:<br>

```text
 - Connect polkat wallet
 
 - Computing resource market
    - List of resources available for purchase
    - Conditional query resource information
    - Buy resources
    
 - My shared resources
    - List of resources I rent
    - Conditional query my rental resource information list
    - Modify the unit price of rental resources
    - Increase rental time
    - Rent again
    - Pledge amount
    - Get back the pledge amount
    - Pledge information display
    - List of resource agreements I rent
    - Receive benefits
 
 - Resources I use
    - List of resources I purchased
    - Purchase Resource Renewal
    - Receive penalty amount
    - Order List
    - Cancel order

```
## 6. Knowledge base

### 6.1 Team blog

> https://github.com/hamster-shared
>


## 7. Contributors

Thank you for considering your contribution to hamster!

<a href="https://github.com/hamster-shared/frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hamster-shared/frontend" />
</a>

## 8. Commercial considerations

If you use this project for commercial purposes, please comply with the Apache2.0 agreement and retain the author's technical support statement.

