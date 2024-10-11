import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const handleMessage = async (name,email,message) =>{
    try{
      let request = await client.post("/sendMessage",{
        name:name,
        email:email,
        message:message,
      });
      if(request.status === httpStatus.OK){
        console.log("every thing ok done.");
        return request.data.message;
      }
    }catch(err){
      throw err;
    }
  }

  const handleRegister = async (name, username,email, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        email:email,
        password: password,
      });
      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });
      console.log("login request sent");
  
      if (request.status === httpStatus.OK) {
        const { token, user } = request.data; 
  
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log(username, "stored");
        return username;
      }
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  };
  

  const router = useNavigate();

  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (e) {
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
    handleMessage,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
