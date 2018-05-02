const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

//Initialize Upload
const upload = multer({
	//Set storage to storage engine variable we set above
	storage: storage,
}).single('myImage');

//Initialize app
const app = express();

//EJS
app.set('view engine', 'ejs');

//Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
	res.send('test');
})



const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));