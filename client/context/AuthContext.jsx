import { useEffect, useState } from "react";
import AuthContext from "./AuthCreateContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import { useNavigate } from "react-router-dom";



const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthProvider = ({children})=>{
   const navigate = useNavigate();

   const [token,setToken] = useState(localStorage.getItem("token"));
   const [authUser,setAuthUser] = useState(null);
   const [onlineUsers,setOnlineUsers] = useState([]);
   const [socket,setSocket] = useState(null);
   
   

   //Check if user is authenticated and if so, set the user data and connect to the socket
   const checkAuth =async ()=>{
      try{
         const {data} = await axios.get("/api/auth/check")
         setAuthUser(data.user);
         connectSocket(data.user);
      }catch(error){
         toast.error(error.message);
      }
   }


   //Login function to handle user authentication and socket connection
   const login = async(state,Credentials)=>{
      try{
         const {data} = await axios.post(`/api/auth/${state}`,Credentials);

         if(data.success){
            console.log("login function -> ",data)
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            localStorage.setItem("token",data.token);
            toast.success(data.message);
            setTimeout(()=>{
               navigate("/");
            },500)
         }
         else{
            toast.error(data.message);
         }

      }catch(error){
         toast.error(error.message);
      }
   }



   //logout function to handle user and socket disconnection
   const logout = async()=>{
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("Logout Successfull");
      socket?.disconnect();
   }



   //update profile function to handle user profile updates
   const updateProfile = async(body)=>{
      try{
         const {data} = await axios.put("/api/auth/update-profile",body);
         if(data.success){
            setAuthUser(data.user);
            toast.success("Profile Updated Successfully");
         }
      }
      catch(error){
         console.log("AuthContext.js updateProfile -> ",error.message);
         toast.error(error.message);
      }
   }



   //Connect socket function to handle socket connection and online users updates
   const connectSocket = async(userData)=>{
      if(!userData || socket?.connected){
         return;
      }
      const newSocket = io(backendUrl,{
         query: {
            userId: userData._id,
         }
      });
      newSocket.connect();
      setSocket(newSocket);
      newSocket.on("getOnlineUsers", (userIds) => {
         setOnlineUsers(userIds);
      })
   }


   useEffect(()=>{
      if(token){
         axios.defaults.headers.common["token"] = token;
      }
      checkAuth();
   },[])

   const value = {
      axios,
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile,
   }; 

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}