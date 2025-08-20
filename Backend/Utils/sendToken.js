export const sendToken = (user, statusCode, message, res)=>{

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    user.save({validateBeforeSave: false})

    res.status(statusCode).cookie("refreshToken", refreshToken,{
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly : true,
    }).cookie("accessToken", accessToken,{
        expires: new Date(Date.now() +  24*60*60*1000),
        httpOnly : true,
    }).json({
        statusCode: 200,
        success: true,
        message,
        user,
        accessToken
    })
}