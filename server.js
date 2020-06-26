const tracer = require('ls-trace').init({
  experimental: {
    b3: true
  },
  url: 'https://ingest.lightstep.com',
  port: 443,
  tags: {
    'lightstep.service_name': 'node-server',
    'lightstep.access_token': process.env.LIGHTSTEP_ACCESS_TOKEN,
  }
})

const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => res.send('Hello Server!'))

let response = app.get('/test', function (req, res) {

  let span = tracer.scope().active()
  span.addTags({ 'tag': 'tag_value' })
  
  // You can directly print the span
  console.log(span)

  res.send('send response');
})

app.listen(port, () => console.log(`Server app listening on port ${port}!`))