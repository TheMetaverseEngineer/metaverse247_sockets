const express = require('express');
const https = require('https')
const app = express()
const cors = require('cors')
const fs = require('fs')
const {lunchSocket } = require('./socket.js');

app.use(cors({
	exposedHeaders: ['Content-Length', 'x-auth-token'],
	origin: '*'
}));

const server = https.createServer({
	// use your key and cert file for validation ssl certificate
	key: fs.readFileSync('selfsigned.key'),
	cert: fs.readFileSync('selfsigned.crt')
}, app).listen(process.env.PORT, () => {
	console.log(`Server Running On Port ${process.env.PORT}`)
})

const io = require('socket.io')(server);
lunchSocket(server)