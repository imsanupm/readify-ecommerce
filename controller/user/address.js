const User = require('../../models/user/userSchema');
const Address = require('../../models/user/addressSchema');


const getAdressPage = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findById(userId).populate('addresses')
       
        
        res.render('showAddress',{addresses:user.addresses});
    } catch (error) {
        console.log('error during getAddress Fucntion',error)
    }
}

const getAddProductFomr = async (req,res) => {
    try {
        res.render('addAddress');
    } catch (error) {
        console.log('error during getAddProductForm',error)
    }
}

const saveAddress = async (req,res) => {
    try {
        userId = req.session.user_id;
        if(!userId){
            return res.json({message:"Unauthorized: User not logged in.",success:false})
        }
    //    const user = await User.findById(userId);
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
      
      const newAddress = new Address({
        fullname:fullName,
        pincode:pincode,
        state:state,
        village_city:villagecity,
        house_flat:houseFlat,
        mobile:mobile,
        district:district,
        landmark:landMark,
        saveAddressType:saveAddressType,
        userId:userId,
      })
    
       const saveAddress = await newAddress.save();
        await User.findByIdAndUpdate(userId,{
            $push:{addresses:saveAddress._id}
        })
      
        res.json({message:"Address saved sucessFully! ",success:true});
    } catch (error) {
        console.log('error during saveAddress Function',error)
    }
}


const getUpdateAddress = async (req,res) => {
    try {
      
        const addressId = req.params.AddressId
        if (!addressId) {
            return res.redirect('/signin');
        }
        const userId = req.session.user_id;
        if(!userId) {
            return res.redirect('/signin');
        }
        const user = await User.findById(userId).populate('addresses')
        const addressToUpdate = user.addresses.find(addr=>addr._id.toString()==addressId);
        res.render('updateAddress',{address:addressToUpdate});
    } catch (error) {
        console.log('error during updateAddress function',error)
    }
}

const updateAddress = async (req,res)=>{
    try {
        const updateAddressId = req.params.addressId;
        const userId = req.session.user_id;
        const user  = await User.findById(userId).populate('addresses');
        const addressToUpdate = user.addresses.find(addr=>addr._id.toString()==updateAddressId);
        
      addressToUpdate.fullname = req.body.fullName;
      addressToUpdate.mobile = req.body.mobile;
      addressToUpdate.pincode = req.body.pincode;
      addressToUpdate.state = req.body.state;
      addressToUpdate.district = req.body.district;
      addressToUpdate.village_city = req.body.villageCity;
      addressToUpdate.house_flat = req.body.houseFlat
      addressToUpdate.landmark = req.body.landmark;
      addressToUpdate.addressType = req.body.addressType;
      
      await addressToUpdate.save();
      res.status(200).json({message:"your data Updated successfully",success:true});
    } catch (error) {
        console.log('error during updateAddress',error)
    }
}

const deleteAddress = async (req,res) => {
    try {
     const userId = req.session.user_id;
     const addressId = req.params.addressId;
     if(!userId){
        return res.redirect('/signin');
     }
      await User.findByIdAndUpdate(userId,{
        $pull:{addresses:addressId}
     })
     await Address.findByIdAndDelete(addressId);
     
     return res.json({message:"Address Deleted Successfully ",success:true})

    } catch (error) {
        console.log('error during delete address',error)
        res.status(500).json({message:"Internal server error",success:false});
    }
}

module.exports = {
    getAdressPage,
    getAddProductFomr,
    saveAddress,
    getUpdateAddress,
    updateAddress,
    deleteAddress,
}