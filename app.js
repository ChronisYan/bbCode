const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Welcome to bbCode my  Dudes');
});

app.get('/supersecret', (req, res) => {
	res.status(418).set('-x', 'Tea is good!').send("418 I'm a Teapot! Congrats you found the Super Sercet Path");
});

app.listen(port, () => {
	console.log(`server is up listening on port ${port}!`);
});
