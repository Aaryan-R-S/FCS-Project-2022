const express = require("express");
const app = express();

const port = process.env.PORT || 3500; // Get environment variable PORT from process.yml configuration.

app.get('/', (req, res) => {
	  res.send('Hello World!');
});

app.get('/again', (req, res) => {
	  res.send('Hello World again!');
});

app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`);
});