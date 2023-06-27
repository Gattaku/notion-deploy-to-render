//クライアントから渡されたJWTが正常化を検証
const JWT = require("jsonwebtoken");
const User = require("../models/user");

const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY);
            return decodedToken;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}



//JWT認証を検証するためのミドルウェア

exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        //そのJWTと一致するユーザーを探してくる
        const user = await User.findById(tokenDecoded.id);
        if (!user) {
            return res.status(401).json("権限がありません");
        }
        // console.log(user);
        // console.log("このタイミングのUserを確認");
        req.user = user;
        next();
    } else {
        return res.status(401).json("権限がありません");
    }
}