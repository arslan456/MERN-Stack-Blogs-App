import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import SideBar from '../../components/sidebar/SideBar'
import './homePage.css'
import { useLocation } from 'react-router'
import API from '../../api'

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const {search} = useLocation();

  useEffect(() => {
    console.log("hello here",)
    const fetchPosts = async () => {
      const res = await API.get(`/api/posts`)

      console.log("hello ", res)
      setPosts(res.data)
    }
    fetchPosts()
  }, [search])
  return (
    <>
      <Header/>
      <div className="home">
        <Posts posts={posts}/>
        <SideBar/>
      </div>
    </>
  )
}

export default HomePage
