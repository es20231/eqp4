const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

// Get User By Username
router.get(
  "/user/get-by-username/:username",
  requireLogin,
  async (req, res) => {
    const username = req.params.username;

    try {
      // Encontrar o usuário pelo username
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Encontrar os posts do usuário usando a função populate
      const posts = await Post.find({ postedBy: user._id });

      // Retornar o usuário com os posts como atributo
      res.json({
        ...user._doc,
        posts,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário." });
    }
  }
);

// User List
router.get("/user/get-all", requireLogin, (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
    });
});

// Delete User
router.delete("/user/delete/:userId", requireLogin, (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndRemove(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      res.status(200).json({ message: "Usuário removido com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao remover o usuário." });
    });
});

router.put("/user/follow", requireLogin, async (req, res) => {
  const { followId } = req.body;
  const { user } = req;

  try {
    // Added Auth User to Params User Followers List
    const updatedUser = await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: user._id },
      },
      {
        new: true,
      }
    );

    // Added Params User to Auth User Following List
    const updatedLoggedInUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { following: followId },
      },
      { new: true }
    ).select("-password");

    res.json(updatedLoggedInUser);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/user/unfollow", requireLogin, async (req, res) => {
  try {
    // Remove Auth User from Params User Followers List
    const updatedUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    // Remove Params User from Auth User Following List
    const updatedLoggedInUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");

    res.json(updatedLoggedInUser);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
