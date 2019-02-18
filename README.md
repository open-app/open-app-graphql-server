# Open App GraphQL Server

[![npm version](https://badge.fury.io/js/open-app-graphql-server.svg)](https://badge.fury.io/js/open-app-graphql-server)

A simple server that supports GraphQL schemas as plugins. Made for building apps on top of distributed protocols such as [ssb](https://github.com/ssbc/scuttlebot) and [dat](http://datproject.org).

Used for an implementation of an Open App Ecosystem of interoperable APIs based on distributed protocols.

Works with Node v8 or higher.

## Usage

To try an example simply `npm i` && `npm run install-example` and run `npm run dev` or `yarn dev` to run the example server. Go to [http://localhost:4000/graphql](http://localhost:4000/graphql) to try it out.

To use for your own project simply install with `npm i -S open-app-graphq-server` or `yarn add open-app-graphq-server`.

```
const server = require('open-app-graphql-server')
const ssb = require('ssb-graphql-defaults')
const dat = require('dat-graphql')
const economic = require('economic-sentences-graphql')

server([
  ssb,
  dat,
  economic,
])
// Starts a Secure Scuttlebot server and a client that feeds a GraphQL layer
// Use http://localhost:4000/graphql
```
`Blobs` are served from `localhost:7777/` using the [ssb-serve-blobs](https://github.com/ssbc/ssb-serve-blobs) plugin. Exmaple:

 `http://localhost:7777/&AWg5t0YSygakE2Ky9M338qoHC5p4GOqdwFvBU/6MpsY=.sha256`

Check out [economic-sentences-graphql](https://github.com/open-app/economic-sentences-graphql) for an example of how to make a plugin.

### Plans

- Transport over [multiserver](https://github.com/ssbc/multiserver) instead of Express
- Schema to deal with `fs`
- Have plugins that include not only GraphQL schemas but also `ssb` plugins and `flumedb` views.