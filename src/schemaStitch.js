const { mergeSchemas, makeExecutableSchema, makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools')
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')

const createRemoteSchema = async (uri) => {
  const link = new HttpLink({ uri, fetch })
  try {
    remoteSchema = await introspectSchema(link)
    return await makeRemoteExecutableSchema({
      schema: remoteSchema,
      link,
    })
  } catch (err) {
    console.log('Failed loading remote schema, ', err)
  }
}


const getSchemas = async (plugins) => {
  let schemas = []
  await Promise.all(plugins.map(async (pl, index) => {
    let schema = null
    if (pl.uri) {
      schema = await createRemoteSchema(pl.uri)
    } else if (pl.typeDefs && pl.resolvers) {
      schema = makeExecutableSchema(pl)
    }
    if (schema) return schemas.push(schema)
  }))
  return schemas
}

const schemaStitch = async (plugins) => {
  try {
    schemas = await getSchemas(plugins)
    return mergeSchemas({
      schemas,
    }) 
  } catch (err) {
    console.log('Error setting schema', err)
  }
}

module.exports = (plugins) => schemaStitch(plugins)