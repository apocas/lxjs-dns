var dns = require('native-dns'),
  server = dns.createServer();

server.on('request', function (request, response) {
  console.log(request.question[0].name);

  if(request.question[0].name.indexOf("lxjs.dev") !== -1) {
    response.answer.push(dns.A({
      name: request.question[0].name,
      address: '10.0.5.50',
      ttl: 600,
    }));

    response.send();
  } else {
    var req = dns.Request({
      question: request.question[0],
      server: { address: '8.8.8.8', port: 53, type: 'udp' },
      timeout: 1000,
    });

    req.on('timeout', function () {
      console.log('Timeout in making request!');
    });

    req.on('message', function (err, answer) {
      answer.answer.forEach(function (a) {
        response.answer.push(a);
      });
      response.send();
    });

    req.send();
  }
});

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(53);