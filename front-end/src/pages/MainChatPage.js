import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from "socket.io-client";
// import { collection, onSnapshot, query } from 'firebase/firestore';
// import { dbFirebase } from '../firebase-config';

function MainChatPage() {
  let navigate = useNavigate();

  const [chatsList, setChatLists] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [chatError, setChatError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);
  const socket = useRef();
  

  useEffect(() => {
    socket.current = io("http://localhost:4000");
    socket.current.on("test", (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    async function fetchUsersChat () {
      if (user) {
        const response = await fetch(`http://localhost:4000/chats`, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
          // body: JSON.stringify({
          //     "userId": id
          // })
        });
        let json = await response.json();
        if (json.status === 200) {
          const { data } = json;
          data.sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent)); // sorted based on date
          setAllChats(data);
          setChatError(null);
          setLoading(false);
        } else {
          setLoading(false);
          setChatError({error: json.error, status: json.status });
        }
      }
    }
    fetchUsersChat();
  }, [user]);


  function LoadingChat() {
    return (
      Array.from({length: 6}).map((_, idx) => {
        return (
          <div key={idx} className="eachChatDisplay">
            <div className="chatImg chatImgLoading"></div>
            <div className="chatDetails chatDetailsLoading"></div>
          </div>
        );
      })
    );
  }


  function Chat({ chat }) {
    const ifRead = chat.read;
    const today = new Date();
    const todayFormat = new Date(today.getMonth() + 1  + "/" + today.getDate() + "/" + today.getFullYear());
    const givenDate = new Date(chat.date_sent);
    const diff = todayFormat.getTime() - givenDate.getTime();
    const countedDays = diff / (1000 * 3600 * 24);
    const daySent = new Date(today);
    daySent.setDate(daySent.getDate() - countedDays);
    const getDay = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    let dateDisplay;
    if (countedDays <= 6 && countedDays >= 1) {
      dateDisplay = getDay[daySent.getDay()];
    } else if (countedDays === 0) {
      dateDisplay = chat.time_sent;
    } else {
      dateDisplay = `${daySent.getMonth() + 1}/${daySent.getDate()}/${daySent.getFullYear()}`;
    }


    return (
      <div onClick={() => {navigate(`/chatroom/${chat.id}`, {state: {name: chat.first_name, senderImg: chat.user_image}})}} className="eachChatDisplay">
        
        {/* image */}
        <div className="chatImg">
          <img src={chat.user_image} alt="username pic"/>
        </div>

        {/* chat details */}
        <div className="chatDetails">
          {/* Username and time message sent*/}
          <div className="topChatDetails">
            <h4>{chat.first_name}</h4>

            {ifRead ? (
                <p className="gray">{dateDisplay}</p>
              ) : (
                <p>{dateDisplay}</p>
              )
            }
          </div>

          {/* last text and notifcations */}
          <div className="bottomChatDetails">
            {chat.last_text.length < 30 ? (
              <p>{chat.last_text}</p>
            ) : (
              <p>{chat.last_text.substring(0, 30)}...</p>
            )}
            {ifRead ? (null) : (<p>{chat.notifications}</p>)}
          </div>

        </div>
      </div>
    );
  }


  function DisplayChats() {
    return (
      <>
        {allChats?.slice(0).reverse().map((chat) => <Chat key={chat.id} chat={chat}/>)}
      </>
    );
  }


  function NotLoggedInDisplay() {
    return (
      <div className="notLoggedInBookmark">
        <h2>You are not logged in</h2>

        <div className="displayLogInBtn">
          Login
        </div>
      </div>
    );
  }


  return (
    <div className={`chatPage ${ifDarkMode && "darkTheme"}`}>
      {/* header */}
      <div className={`chatPageHeader ${ifDarkMode && "darkTheme"}`}>
        <h1>Messages</h1>
      </div>

      {/* body */}
      <div className={`displayAllChats ${ifDarkMode && "darkTheme"}`}>

        {!user ? (
          <NotLoggedInDisplay />
        ) : (loading) ? (
          <LoadingChat />
        ) : (allChats.length === 0 && !chatError) ? (
          <h3>No chats</h3>
        ) : (
          <DisplayChats />
        )}


        {chatError && user && 
          <div>
            <h1 className='error'>
              {chatError.status}
            </h1>
            <h3 className="error">
              {chatError.error}
            </h3>
          </div>
        }
      </div>
    </div>
  );
}


export default MainChatPage;


