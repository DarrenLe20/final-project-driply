import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import { useAuthContext } from "../hooks/useAuthContext";

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [fakeName, setFakeName] = useState(""); // remove after sprint 1, only used to randomize displayed username using mockaroo
  const [description, setDescription] = useState("");
  const [postError, setPostError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [followedChanged, setFollowedChanged] = useState(false);
  const { ifDarkMode } = useContext(DarkModeContext);

  const randomSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
  const randomIndex1 = Math.floor(Math.random() * randomSize.length);
  const randomIndex2 = Math.floor(Math.random() * randomSize.length);
  const randomIndex3 = Math.floor(Math.random() * randomSize.length);
  const randomIndex4 = Math.floor(Math.random() * randomSize.length);
  const randomIndex5 = Math.floor(Math.random() * randomSize.length);

  useEffect(() => {
    setFollowedChanged(false);
    async function fetchProfileInfo() {
        const response = await fetch(`https://my.api.mockaroo.com/post.json?key=9e339cc0`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
            // body: JSON.stringify({
            //     "postId": id
            // })
        });
        let json = await response.json();
        if (response.status === 200) {
            console.log(json);
            const p = json[0];
            setFakeName(p.username);
            setDescription(p.description);
            setPostError(null);
            setLoading(false);
        } else {
            setPostError(response.status);
            setLoading(false);
        }
    }
    console.log(user);
    fetchProfileInfo();
  }, [followedChanged]);

  const handleFollow = () => {
    setFollowed(!followed);
    setFollowedChanged(true);
  };

  function FollowButton() {
    if (!followed){
      return (
        <button
          onClick={() => handleFollow()}
          className='btn btn-secondary'
        >
            Follow
        </button>
      )
    }
    else{
      return (
        <button
            onClick={() => handleFollow()}
            className='btn btn-primary'
        >
            Followed
        </button>
      )
    }
  }
  
  return (
    <div className={`profileContainer ${ifDarkMode && "darkTheme"}`}>
      <div className="right">{user ? <FollowButton /> : <div></div>}</div>
      <div className="pfpContainer">
        <div className="pfp">
          <img src={`https://picsum.photos/${randomSize[randomIndex5]}/300`} alt="pic" />
        </div>
      </div>
      <div className="pf-name">
        <p>{fakeName}</p>
      </div>
      <div className="pf-bio">
        <p>
          {description}
        </p>
      </div>
      <div className="profileInfo">
        <div
          className={
            ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
          }
        >
          <p>3</p>
          <p>Posts</p>
        </div>
        <div
          onClick={() => navigate("/followers")}
          className={
            ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
          }
        >
          <p>3</p>
          <p>Followers</p>
        </div>
        <div
          onClick={() => navigate("/following")}
          className={
            ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
          }
        >
          <p>3</p>
          <p>Following</p>
        </div>
      </div>

      <div
        className={`${ifDarkMode ? "postsContainer-dark" : "postsContainer"}`}
      >
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex1]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex2]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex3]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex4]}/300`}
              alt="pic"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
