var express    = require("express");
var logfmt     = require("logfmt");
var sh        = require('exec-sync');

var app = express();
app.use(logfmt.requestLogger());

app.get('/deploy', function(req, res) {
  sh('./.travis/configure_ssh.sh');
  sh('./deploy.sh');
  res.send('OK');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
