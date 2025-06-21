const code = require('../../helpers/user/statusCode');
const User = require('../../models/user/userSchema');


// const uploadedProfilePic = async (req,res) => {
//     try {
//         const userId = req.session.user_id;    
    
//     if (!req.file || !req.file.path) {
//       return res.status(code.HttpStatus.BAD_REQUEST).json({ success: false, message: "No image uploaded" });
//     }

//     const imageUrl = req.file.path;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { photo: imageUrl },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(code.BAD_REQUEST).json({ success: false, message: "User not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Profile picture updated",
//       imageUrl: user.photo,
//     });
        
//     } catch (error) {
//         console.log('error during uploadedProfilePic========',error);
        
//     }
// }

const uploadedProfilePic = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(code.BAD_REQUEST).json({ success: false, message: "User not found" });
    }

    // ✅ 1. Check if file is uploaded
    let imageUrl;
    if (req.file && req.file.path) {
        console.log('req.file====',req.file,req.file.path);
        
      imageUrl = req.file.path; // use uploaded image
    } else if (user.photo && !user.photo.includes('default')) {
      imageUrl = user.photo; // keep existing image
    } else {
      imageUrl = "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/readify/default-profile.png"; // default image
    }

    // ✅ 2. Update user photo
    user.photo = imageUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated",
      imageUrl: user.photo,
    });

  } catch (error) {
    console.error('error during uploadedProfilePic========', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { uploadedProfilePic };


