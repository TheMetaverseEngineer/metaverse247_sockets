const express = require('express');
const https = require('https')
const app = express()
const cors = require('cors')
const {lunchSocket } = require('socket.js');

app.use(cors({
	exposedHeaders: ['Content-Length', 'x-auth-token'],
	origin: '*'
}));

const server = https.createServer({
	key: fs.readFileSync('your ssl key file path'),
	cert: fs.readFileSync('your ssl cert file path')
}, app).listen(process.env.PORT, () => {
	console.log(`Server Running On Port ${process.env.PORT}`)
})

const io = require('socket.io')(server);
lunchSocket(server)