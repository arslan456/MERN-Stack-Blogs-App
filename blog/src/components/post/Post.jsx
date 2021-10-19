import React from 'react'
import { Link } from 'react-router-dom'
import './post.css'

const Post = ({post}) => {
  const PF = "https://blogss-post.herokuapp.com/images/"
  return (
    <div className="post">
      {post.photo && (
        <img
          className="postImg"
          src={PF + post.photo}
          alt="blog Img"
        />
      )}
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
        <span className="postTitle">{post.title}</span>
        </Link>
        <div className="singlePost">
            <i className="singleIcon far fa-thumbs-up"></i>
            <p className="singleIcon">{post.likes.length}</p>
        </div>
        <hr/>
        <span className="postDate">{new Date(post.createdAt).toDateString}</span>
      </div>
      <p className="postDesc">
        {post.desc}
      </p>
    </div>
  )
}

export default Post
