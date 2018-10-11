# Open App GraphQL Server

A simple server that supports GraphQL schemas as plugins. Made to work with many distributed protocols such as [ssb](https://github.com/ssbc/scuttlebot) and [dat](http://datproject.org).

Works with Node v8 or higher.

## Usage

To try the example:
```
cd example
npm i
cd ..
```

Then simply run `npm run dev` or `yarn dev` to run build and run the example server. Go to [http://localhost:4000/graphql](http://localhost:4000/graphql) to try it out.

To use for your own project simply install with `npm i -S open-app-graphq-server` or `yarn add open-app-graphq-server`.

```
require("@babel/polyfill") // required by ssb-graphql-defaults

const server = require('open-app-graphql-server')
const ssbDefaults = require('ssb-graphql-defaults')

server([
  ssbDefaults
])
// Starts a Secure Scuttlebot server and a client that feeds a GraphQL layer
// Use http://localhost:4000/graphql
```

Check out [economic-sentences-graphql](https://github.com/open-app/economic-sentences-graphql) for an example of how to make a plugin.


### Plans

- Transport over [multiserver](https://github.com/ssbc/multiserver) instead of Express
- Schema to deal with `fs`