(function () {
  module.exports = ({ key }) => {
    return function corsMiddleware(req, res, next) {
      if (!key || !Object.keys(req.body).length) {
        next()
      } else if (req.get('KEY') === key) {
        next()
      } else {
        console.log('Time:', Date.now())
        res.json({ error: 'Not Authorized!' })
        throw 'Not Authorized!'
      }
    }
  }
})()