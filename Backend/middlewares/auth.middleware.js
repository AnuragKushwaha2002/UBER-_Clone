const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel =require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');
const bcrypt =require('bcrypt');

module.exports.authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = 
        (req.cookies && req.cookies.token) || 
        (authHeader && authHeader?.startsWith("Bearer ") && authHeader?.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token not found" });
    }
    
    const isBlacklisted =await blacklistTokenModel.findOne({ token: token});

    if(isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }


    try {
        // console.log("Token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Payload:", decoded);

        const user = await userModel.findById(decoded._id);
        // console.log("User Found:", user);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error("Error in Authentication Middleware:", err);
        return res.status(401).json({ message: "Unauthorized: Invalid token or server error" });
    }
};

module.exports.authCaptain = async (req,res,next)=> {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if(isBlacklisted){
        return res.status(401).json({ message: 'Unauthorized: Token is blacklisted'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    }catch(err){
        res.status(401).json({message:'Unaithorized'});
    }

}
