const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const optionSSL = {
  key: fs.readFileSync('./www.playstarfall.com.key'),
  cert: fs.readFileSync('./www_playstarfall_com.crt'),
};

const app = express();
const prisma = new PrismaClient();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

// subscribe route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  const existingOne = await prisma.subscribe.findFirst({
    where: { email: email },
  });

  if (existingOne) {
    res.status(422).send({
      message: 'Same email exists!',
    });
  } else {
    const newSubscribe = await prisma.subscribe.create({
      data: {
        email: email,
      },
    });

    res.send(newSubscribe);
  }
});

// set port, listen for requests
// const PORT = process.env.PORT || 80;
// app.use(express.static(__dirname + '/build'));

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const httpApp = express();

httpApp.use(express.static(__dirname + '/build'));

httpApp.get('*', function (req, res, next) {
  res.redirect('https://' + req.headers.host + req.path);
});

http.createServer(httpApp).listen(80, function () {
  console.log('Express TTP server listening on port 80');
});

https.createServer(optionSSL, app).listen(443, function () {
  console.log('Express HTTP server listening on port 443');
});