import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next) =>{

    try {

        const token = req.cookies.token;

        if(!token)
        {
            return res.status(401).json({
                message:"User not Authenticated",
                success:false,
            })
        }

        const decode  = await jwt.verify(token,process.env.SECRET_KEY);

        if(!decode)
        {
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        }

        req.id = decode.userId  // i store the id in variable (req.id)  which i stored in (utils/generatetoen.js)
        next();

        
    } catch (error) {
        
    }

}

export default isAuthenticated