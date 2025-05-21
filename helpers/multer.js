// const multer = require('multer');
// const path = require('path');
// const fs = require('fs')


// const uploadImages = path.join(__dirname,'../public/uploadedImages');

// if (!fs.existsSync(uploadImages)) {
//   fs.mkdirSync(uploadImages, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadImages); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); 
//   }
// });


// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images are allowed!'), false);
//   }
// };

// // Initialize Multer
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// module.exports = upload;


const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  
  cloudinary:cloudinary,
  params:{
    folder:"readify",
    allowed_formats:['jpg', 'jpeg', 'png', 'webp'],
    
  }
})

const upload = multer({storage});
module.exports = upload;
