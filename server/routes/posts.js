const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

//CREATE POST 
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
})

//UPDATE POST
router.put("/:id", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else{
      res.status(401).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (error) {
    res.status(500).json(error)
  }
});

//Get Post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
})

//Get all posts
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if(username){
      posts = await Post.find({username})
    } else if (catName) {
      posts = await Post.find({
        categories: {
        $in: [catName]
        },
    });
   } else {
     posts = await Post.find()
   }
   res.status(200).json(posts);
  } catch (error) {
   res.status(500).json(error);
  } 
})

//like post
const likePost = async(req, res) => {
  const { id } = req.params;
// console.log("req-",req.body)
  if(!req.body.userId) {
    // console.log(req.body.userId)
    return res.json({message: 'unauthurized!'})
  }

  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await Post.findById(id);

  const index = post.likes.findIndex((id) => id ===String(req.body.userId));

  if (index === -1) {
    post.likes.push(req.body.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.body.userId));
  }
  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
  res.status(200).json(updatedPost);
}

router.patch('/likePost/:id', likePost)

module.exports = router;