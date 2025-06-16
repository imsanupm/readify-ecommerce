const User = require("../models/userschema");

const userAuth = async (req, res, next) => {
  //console.log("Session User:", req.session.user);
  try {
    if (!req.session.user) {m
      console.log("User not logged in. Redirecting...");
      return res.redirect("/login"); // User not logged in
    }
  

    const user = await User.findById(req.session.user); // Fix case issue here

    if (!user) {
      console.log("User not found in database");
      req.session.user = null;
      return res.redirect("/login");
    }

    if (user.isBlocked) {
      // console.log("User is blocked");
      console.log(`User ${user.email} is blocked. Logging out.`);
      req.session.destroy(); // Destroy session if user is blocked // Force logout for blocked users
      return res.redirect("/login");
    }

    next(); // Proceed if user is authenticated and not blocked
  } catch (error) {
    console.log("Error in User auth middleware:", error);
    res.status(500).send("Internal server error");
  }
};

const adminAuth = (req, res, next) => {
  if (req.session.admin || req.path === "/admin/login") {
    return next();
  }
  
  return res.redirect("/admin/login");
};

module.exports = {
  userAuth,
  adminAuth,
};