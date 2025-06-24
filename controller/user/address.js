const User = require('../../models/user/userSchema');
const Address = require('../../models/user/addressSchema');
const findUser = require('../../helpers/user/getUser');


const getAdressPage = async (req, res) => {
    try {
      const userId = req.session.user_id;
       const userData = await findUser.getUserById(req.session.user_id);
      const page = parseInt(req.query.page) || 1;
      const limit = 6; // Show 6 addresses per page
  
      const options = {
        page,
        limit,
        sort: { isDefault: -1, _id: -1 }, // Default address first, then latest
        lean: true,
        leanWithId: false,
      };
  
      const query = { userId };
      const result = await Address.paginate(query, options);
  
      res.render('showAddress', {
        addresses: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages,
        user_name:userData.name
      });
    } catch (error) {
      console.error('Error in getAdressPage:', error);
      res.status(500).send('Something went wrong');
    }
  };
  
  
const getAddAdressForm = async (req,res) => {
    try {
        res.render('addAddress');
    } catch (error) {
        console.log('error during getAddProductForm',error)
    }
}

const saveAddress = async (req,res) => {
    try {
        userId = req.session.user_id;
        console.log('user id----------',userId);
        if(!userId){
            return res.json({message:"Unauthorized: User not logged in.",success:false})
        }
        console.log('-----------------altleas you getting the call')
        console.log(req.body);

      const {
      fullName,
      pincode,
      state,
      villagecity,
      houseFlat,
      mobile,
      district,
      landMark,
      saveAddressType,
      makeDefault
      } = req.body
       if(makeDefault==true){
        await removeDefaultValue(userId);
       }
      
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
        isDefault:makeDefault==true?true:false,
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

const removeDefaultValue = async (userId) => {
    try {
        await Address.updateOne(
            {userId:userId,isDefault:true},
            {$set:{isDefault:false}}
        )
        return
    } catch (error) {
        console.log('---from--removeDefault-',error)
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
    getAddAdressForm,
    saveAddress,
    getUpdateAddress,
    updateAddress,
    deleteAddress,
}