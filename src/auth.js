module.exports = (req, res, next) => {
  if (!process.env.KEY) {
    next()
  }
  console.log('Time:', Date.now())
  if (req.get('KEY') === process.env.KEY) {
    next()
  } else {
    res.json({ error: 'Not Authorized!' })
    throw 'Not Authorized!'
  } 
}