const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');

import { environment } from './environment';

const PORT = process.env.PORT || environment.port;

var app = express();

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, '../../docs/')));
app.use('/cantalupi', serveStatic(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, '../../docs/index.html'));
});

app.listen(PORT, () => {
	console.log(`Listening on ${ PORT }`);
});
