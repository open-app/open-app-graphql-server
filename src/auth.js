module.exports = (req, res, next) => {
  if (!process.env.KEY || !Object.keys(req.body).length) {
    next()
  } else if (req.get('KEY') === process.env.KEY) {
    next()
  } else {
    console.log('Time:', Date.now())
    res.json({ error: 'Not Authorized!' })
    throw 'Not Authorized!'
  } 
}