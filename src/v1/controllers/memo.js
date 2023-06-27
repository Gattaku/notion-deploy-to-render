const Memo = require("../models/memo");

exports.create = async (req, res) => {
    try {
        const memoCnt = await Memo.find().count();
        //メモ新規作成
        const memo = await Memo.create({
            user: req.user._id,
            position: memoCnt > 0 ? memoCnt : 0,
        });
        res.status(201).json(memo);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.getAll = async (req, res) => {
    try {
        const memos = await Memo.find({ user: req.user._id }).sort("-position")
        res.status(200).json(memos);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getOne = async (req, res) => {
    const { memoId } = req.params;
    try {
        const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
        if (!memo) return res.status(404).json("メモが存在しません");
        res.status(200).json(memo);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.updata = async (req, res) => {
    const { memoId } = req.params;
    const { title, description } = req.body;
    // console.log("reqそのもの", req.headers);
    // console.log(req.body);
    // console.log(title);
    // console.log(description);

    try {
        if (title === "") req.body.title = "無題";
        if (description === "") req.body.description = "ここに自由に記入してください";

        const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
        if (!memo) return res.status(404).json("メモが存在しません");
        const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
            $set: req.body,
        })
        res.status(200).json(updatedMemo);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    const { memoId } = req.params;
    try {
        const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
        if (!memo) return res.status(404).json("メモが存在しません");

        await Memo.deleteOne({ _id: memoId });

        res.status(200).json("メモを削除しました");
    } catch (err) {
        res.status(500).json(err);
    }
}