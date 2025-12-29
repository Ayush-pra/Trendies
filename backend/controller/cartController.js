const User = require("../model/userModel");

const addToCart = async (req, res)=>{
    try{
        const {itemId, size} = req.body;
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).json({message:"User not Found"});
        }
        const cartData = userData.cartData || {};
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size]+=1;
            }
            else{
                cartData[itemId][size]=1;
            }
        }
        else{
            cartData[itemId]={};
            cartData[itemId][size]=1;
        }
        await User.findByIdAndUpdate(req.userId , {cartData});
        return res.status(201).json({message:"Added to Cart"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"AddToCart Error"});
    }   
}

const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartData = userData.cartData || {};

    if (quantity === 0) {
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];

        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }

    await User.findByIdAndUpdate(req.userId, { cartData });
    return res.status(200).json({ message: "Cart updated", cartData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "updateCart Error" });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartData = userData.cartData || {};
    return res.status(200).json(cartData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "getUserCart Error" });
  }
};


module.exports={addToCart,updateCart,getUserCart};
