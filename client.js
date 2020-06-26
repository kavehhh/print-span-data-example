const request = require('request');
var opentracing = require('opentracing');
var lightstep   = require('lightstep-tracer');

opentracing.initGlobalTracer(new lightstep.Tracer({
    access_token   : process.env.LIGHTSTEP_ACCESS_TOKEN,
    component_name : 'node-client',
    collector_host : 'ingest.lightstep.com',
    collector_port : 443,
    collector_encryption : 'tls',
    propagators    : {
    	[opentracing.FORMAT_HTTP_HEADERS]: new lightstep.B3Propagator(),
      [opentracing.FORMAT_TEXT_MAP]: new lightstep.B3Propagator()
    }
}));

var span = opentracing.globalTracer().startSpan('clientStart');
span.log({ event : 'query_started' });

var spanContext = span.context();
var carrier = {};
opentracing.globalTracer().inject(spanContext, opentracing.FORMAT_HTTP_HEADERS, carrier);

// You can directly print the span
console.log(span)

var options = {
  url: 'http://localhost:3001/test',
  headers: carrier
};

function callback(err, res, body) {
  if (err) { return console.log(err); }
  console.log(body);
}

request(options, callback);

span.finish();