const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools')
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')

const link = new HttpLink({ uri: 'http://[::1]:8080/graphql', fetch });

module.exports = async () => {
  try {
    const schema = await introspectSchema(link)
    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link,
    })
    return executableSchema
  } catch (err) {
    console.log('Failed loading patchql, ', err)
  }
}
