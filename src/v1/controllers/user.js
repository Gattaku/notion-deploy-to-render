const cryptoJS = require("crypto-js");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const User = require("../models/user");

//ユーザー新規登録API
exports.register = async (req, res) => {
    //パスワードの受け取り
    const password = req.body.password;
    try {
        //パスワードの暗号化
        req.body.password = cryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
        //ユーザーの新規登録-->ユーザ名と暗号化されたパスワードが登録される
        const user = await User.create(req.body);
        //JWTの発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "24h",
        });
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json(error);
    }

}


//ユーザーログイン用API
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //DBからユーザーが存在するか探してくる
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "ユーザーが無効です"
                    }
                ]
            })
        }
        //パスワードがあっているかを照合
        const decryptedPassword = cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(cryptoJS.enc.Utf8);
        if (password !== decryptedPassword) {
            return res.status(401).json({
                errors: [
                    {

                        param: "password",
                        msg: "パスワードが無効です"
                    }
                ]
            })
        } else {
            //JWTの発行
            const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: "24h",
            });
            return res.status(200).json({ user, token });
        }


    } catch (err) {
        return res.status(500).json(err);
    }
}
