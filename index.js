const express = require("express");
const app = express();
const PORT = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./src/v1/routes/index");
const cors = require("cors")


app.use(express.static("./build"));
app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:3000",
// }))
app.use("/api/v1", authRoute);

//DBに接続
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_RENDER_URL || process.env.MONGODB_URL);
        console.log("MONGODBに接続中・・・");
        app.listen(process.env.PORT || PORT, () => { console.log("サーバー起動中・・・") })
    } catch (error) {
        console.log(error);
    }
};
connectDB();

