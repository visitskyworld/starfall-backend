const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

// home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Starfall application.' });
});

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
