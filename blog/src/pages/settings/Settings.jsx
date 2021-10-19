import React, { useContext, useState } from 'react'
import API from '../../api';
import SideBar from '../../components/sidebar/SideBar'
import { Context } from '../../context/Context'
import './setting.css'

const Settings = () => {
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const PF = "https://blogss-post.herokuapp.com/images/"
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch({type: 'UPDATE_START'})
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
    };
    if(file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename)
      data.append("file", file)
      updatedUser.profilePic = filename;
      try {
        await API.post("/upload", data)
      } catch (error) {}
    }
    try {
      const res = await API.put(`/api/users/`+ user._id, updatedUser)
      setSuccess(true);
      dispatch({type: "UPDATE_SUCCESS", payload: res.data})
    } catch (error) {
      dispatch({type: "UPDATE_FAILURE"})
    }
  }
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Your Account</span>
          <span className="settingsTitleDelete">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF+user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>{" "}
            </label>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              className="settingsPPInput"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input type="text" placeholder={user.username} onChange={e=>setUsername(e.target.value)}/>
          <label>Email</label>
          <input type="email" placeholder={user.email} onChange={e=>setEmail(e.target.value)}/>
          <label>Password</label>
          <input type="password" onChange={e=>setPassword(e.target.value)}/>
          <button className="settingsSubmitButton" type="submit">
            Update
          </button>
          {success && (
            <span style={{ color: "green", textAlign: "center", marginTop: "20px"}}>Profile has been updated...</span>
          )}
        </form>
      </div>
      <SideBar/>
    </div>
  )
}

export default Settings
