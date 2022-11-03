const express = require("express");
const limitter = require('express-rate-limit');
const cookieParser = require("cookie-parser");
const connectToMongo = require('./db');
const cors = require('cors');
require('dotenv').config();

connectToMongo();

const app = express();
const port = process.env.PORT || 3500; // Get environment variable PORT from process.yml configuration.
const numberOfProxies = (process.env.NODE_ENV === "prod"? process.env.NUMBEROFPROXIES : 15);

app.set('trust proxy', numberOfProxies)
app.use(limitter({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 2 minutes)
	message: 'You have exceeded the 100 requests in 2 minutes time limit!',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use('/document', express.static(`${__dirname}/public`));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/ip', (req, res) => {
	// let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	// ip = ip.toString().replace('::ffff:', '');
	// res.send(ip);
	res.send(req.ip);
})

app.use('/admin', require('./routes/admin'));
app.use('/patient', require('./routes/patient'));

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});