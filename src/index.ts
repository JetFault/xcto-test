import express from 'express';
import path from 'path';
import nocache from 'nocache';

const app = express();
const port = 7678;

app.use(nocache());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1, etag: false }));

app.get('/file/*', (req, res) => {
	const isXcto = req.query.xcto === 'true';
	const isHtml = req.query.html === 'true';

	if (isXcto) {
		res.setHeader('X-Content-Type-Options', 'nosniff');
	}
	if (req.query.mime) {
		res.setHeader('Content-Type', req.query.mime);
	}

	console.log(req.params);
	console.log(req.query);
	
	let script = `
alert("MIME Sniffing: \\n\
ContentType: ${req.query.mime},\\n\
filename: ${req.params[0]},\\n\
xcto: ${isXcto}\\n\
html: ${isHtml}\\n\
");`;

	if (isHtml) {
		script = `<html><head></head><body><script>${script}</script></body></html>`;
	}

	res.send(script);
});

app.listen(port, () => console.log(`XCTO tester listening on port ${port}`));
