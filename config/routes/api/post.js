const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth.js");
const User = require("../../../models/User.js");
const Profile = require("../../../models/Profile.js");
const Post = require("../../../models/Post.js");

router.post(
  "/",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ Date: -1 });
    res.send(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      res.status(400).json({msg:"No post found"})
    }
    res.send(post);
  } catch (err) {
    if (err.kind!=='ObjectId') {
      res.status(400).json({msg:"No post found"})
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.user.toString()!== req.user.id) {
      res.status(401).json({msg:"You are not authorised"})
    }
    await post.remove();
    res.send(post).json({msg:"post removed"});
  } catch (err) {
    if (err.kind!=='ObjectId') {
      res.status(400).json({msg:"No post found"})
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
