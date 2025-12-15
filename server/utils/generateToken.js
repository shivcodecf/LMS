// In your utils/generateToken.js file
import jwt from 'jsonwebtoken'

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      
      // 🚨 FIX 1: Change 'strict' to 'none' to allow cross-site cookies.
      sameSite: "none", 
      
      // 🚨 FIX 2: MUST be true when SameSite is 'none' and running over HTTPS (Vercel/Render).
      secure: true, 
      
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user
    });
};