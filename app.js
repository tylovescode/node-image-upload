const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb) {
		//First parameter is err, but we don't want an error so we put NULL
		//path.extname will attach extension
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

//Initialize Upload
const upload = multer({
	//Set storage to storage engine variable we set above
	storage: storage,
	//Set file size limit in bytes
	limits: {fileSize: 1000000},
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb);
	}
	//.single because it's a single image
	//myImage is what we named it in index.ejs
}).single('myImage');

//Check File Type
function checkFileType(file, cb) {
	//Allowed extensions
	const filetypes = /jpeg|jpg|png|gif/;
	//Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	//Check mime
	const mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images only');
	}
}


//Initialize app
const app = express();

//EJS
app.set('view engine', 'ejs');

//Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if(err){
			res.render('index', {
				msg: err
			});
		} else {
			if(req.file == undefined) {
				res.render('index', {
					msg: 'Error - no file selected'
				});
			} else {
				res.render('index', {
					msg: 'File uploaded',
					file: `uploads/${req.file.filename}`
				});
			}
		}
	})
})



const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));