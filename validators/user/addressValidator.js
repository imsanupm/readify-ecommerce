
const User = require('../../models/user/userSchema');

const addressFormValidate = async (req,res,next) => {
    try {
        const pincodeRegex = /^\d{6}$/;
        // const phonenumberRegex = /^[6-9]\d{9}$/;
        const nameRegext = /^[A-Za-z]{3,}$/
        const {
            fullName,
            pincode,
            state,
            villagecity,
            houseFlat,
            mobile,
            district,
            landMark,
            saveAddressType
            } = req.body
            if(!fullName||!pincode||!state||!villagecity||!houseFlat||!mobile||!district||!landMark){
                  return res.json({message:"All fields are required fill carefully",success:false})
                }
                if(!pincodeRegex.test(pincode)){
                    return res.json({message:"Pincode should contain 6 numbers and Do not contain any characters ",success:false})
                }
                // if(!phonenumberRegex.test(mobile)){
                //     return res.json({message:"Phone Number atleast contain 10 digits and should not contain any numbers ",success:false})
                // }
                if(nameRegext.test(fullName)){
                    return res.json({message:"Name should not contain any numbers and needed more than two words",success:false});
                }
                next()

    } catch (error) {
        console.log('error during validate the addressFormValidate',error)
    }
}



const updateAddress = async (req, res, next) => {
    try {
      const pincodeRegex = /^\d{6}$/;
      const phonenumberRegex = /^[6-9]\d{9}$/;
      const nameRegex = /^[A-Za-z]{3,}$/;
  
      const {
        fullName,
        pincode,
        state,
        villageCity,
        houseFlat,
        mobile,
        district,
        landmark,
        addressType,
      } = req.body;
      console.log
  
      if (!fullName || !pincode || !state || !villageCity || !houseFlat || !mobile || !district || !landmark) {
        return res.json({ message: "All fields are required. Fill carefully.", success: false });
      }
  
      if (!pincodeRegex.test(pincode)) {
        return res.json({ message: "Pincode must contain 6 digits only.", success: false });
      }
  
      if (!phonenumberRegex.test(mobile)) {
        return res.json({ message: "Phone number must be 10 digits and valid.", success: false });
      }
  
      if (!nameRegex.test(fullName)) {
        return res.json({ message: "Name should be at least 3 letters and contain only alphabets.", success: false });
      }
  
      const updateAddressId = req.params.addressId;
      const userId = req.session.user_id;
      const user = await User.findById(userId).populate("addresses");
      const addressToUpdate = user.addresses.find(addr => addr._id.toString() === updateAddressId);
      console.log('address to update middleware',addressToUpdate)
  

    const isSameData =
  addressToUpdate.fullname.toString().trim().toLowerCase() === fullName.toString().trim().toLowerCase() &&
  addressToUpdate.mobile.toString().trim() === mobile.toString().trim() &&
  addressToUpdate.pincode.toString().trim() === pincode.toString().trim() &&
  addressToUpdate.state.toString().trim().toLowerCase() === state.toString().trim().toLowerCase() &&
  addressToUpdate.district.toString().trim().toLowerCase() === district.toString().trim().toLowerCase() &&
  addressToUpdate.village_city.toString().trim().toLowerCase() === villageCity.toString().trim().toLowerCase() &&
  addressToUpdate.house_flat.toString().trim().toLowerCase() === houseFlat.toString().trim().toLowerCase() &&
  addressToUpdate.landmark.toString().trim().toLowerCase() === landmark.toString().trim().toLowerCase();
  addressToUpdate.addressType.toString().trim().toLowerCase()===addressType.toString().trim().toLowerCase();
  
      if (isSameData) {
        return res.status(400).json({ message: "No changes detected in the address.", success: false });
      }
  
      next();
    } catch (error) {
      console.log("Error during updateAddress middleware", error);
    }
  };
  

module.exports = {
    addressFormValidate,
    updateAddress
}