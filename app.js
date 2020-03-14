const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('<h1>Welcome to bbCode my  Dudes</1><a href="https://dev.to/chronisg"><img src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg" alt="Chronis Giannakakis\'s DEV Profile" height="30" width="30"></a>');
});

app.get('/supersecret', (req, res) => {
	res.status(418).set('X-Tea', 'Tea is good!').send("418 I'm a Teapot! Congrats you found the Super Sercet Path");
});

app.listen(port, () => {
	console.log(`server is up listening on port ${port}!`);
});
