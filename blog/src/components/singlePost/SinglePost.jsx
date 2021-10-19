import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import API from '../../api'
import { Context } from '../../context/Context'
import './singlePost.css'

const SinglePost = () => {
  const location = useLocation()
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [count, setCount] = useState(0);
  const PF = "https://blogss-post.herokuapp.com/images/";

  // console.log("userrrrr", user)
  const getPost = async () => {
    const res = await API.get(`/api/posts/`+ path)
    console.log("ressssssssss" ,res)
    setPost(res.data);
    setTitle(res.data.title);
    setDesc(res.data.desc)
    setCount(res.data.likes.length)
  }
  useEffect(() => {
      getPost()
  }, [path])

  const handleDelete = async () => {
    try {
      await API.delete(`/api/posts/${post._id}`, {
        data: {username:user.username},
      });
      window.location.replace("/")
    } catch (error) {
      
    }
  }

  const handleUpdate = async () => {
    try {
      await API.put(`/api/posts/${post._id}`, {
        username: user.username,
        title,
        desc
      });
      setUpdateMode(false);
    } catch (error) {
      
    }
  }

  const handleLike = async () => {
    try {
      await API.patch(`/api/posts/likePost/${post._id}`, {
        userId: user._id
      })
      getPost();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img
            className="singlePostImg"
            src={PF + post.photo}
            alt=""
          />
        )}
        
        {updateMode? <input type="text" value={post.title} className="singlePostTitleInput"/>: (
          <h1 className="singlePostTitle">
            <div className="singlePostLike">
            <i className="singlePostIcon far fa-thumbs-up" onClick={handleLike}></i>
            <p className="singlePostIcon">{count}</p>
            </div>
          {title}
          {post.username === user?.username && (
            <div className="singlePostEdit">
            <i className="singlePostIcon far fa-edit" onClick={() => setUpdateMode(true)}></i>
            <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
          </div>
          )}
        </h1>
        )}
        <div className="singlePostInfo">
          <span>
            Author:
            <b className="singlePostAuthor">
              <Link to={`/?user=${post.username}`} className="link">
                {post.username}
              </Link>
            </b>
          </span>
          <span className="singlePostDate">{new Date(post.createdAt).toDateString()}</span>
        </div>
        {updateMode ? 
          (
          <textarea 
            className="singlePostDescInput" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)}/> ) : (
          <p className="singlePostDescInput">
          {desc}
        </p>
        )}
        {updateMode && 
          <button className="singlePostButton" onClick={handleUpdate}>Update</button>
        }
      </div>
    </div>
  )
}

export default SinglePost
