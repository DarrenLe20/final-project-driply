import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";


const PostPage = () => {
    const navigate = useNavigate();
    const form = useRef();
    const [comment, setComment] = useState("");
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [likes, setLikes] = useState([]);
    const [likeChanged, setLikeChanged] = useState(false);
    const [postError, setPostError] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        setLikeChanged(false);
        async function fetchPostInfo() {
            const response = await fetch(`url`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "PostId": id
                })
            });
            let json = await response.json();
            if (response.status === 200) {
                console.log(json);
                setPostError(null);
                setLoading(false);
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        fetchPostInfo();
    }, [likeChanged]);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();

    };

    const handleLike = () => {
        if (likes.filter(e => (e.localeCompare(user.username) === 0)).length === 0){
            likes.push(user.username);
        }
        else{
            const index = likes.indexOf(user.username);
            likes.splice(index, 1);
        }
        setLikeChanged(true);
        console.log(likes);
    };

    return (
        <div className="mb-10">
            <div className="row align-items-center mx-auto">
                <div className="col-8 d-flex align-items-center px-0 mx-auto">
                    <div onClick={() => navigate("/profile")} className="followingImg">
                        <img src="https://picsum.photos/id/64/200" alt="user img"/>
                    </div>
                    <span onClick={() => navigate("/profile")}>Username</span>
                </div>
                <div className="col-4 d-flex justify-content-end px-0 mx-auto">
                    <span className="mr-3">Cost</span>
                </div>
            </div>
            <img className="center-block img-responsive" src="https://picsum.photos/id/24/131/150" alt="pic"/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum scelerisque egestas hendrerit. Nam in ornare metus. Sed gravida vel orci vitae gravida. Nulla hendrerit, quam et varius posuere, orci lacus condimentum ipsum, at maximus nisi arcu sit amet erat. Nulla gravida malesuada orci, eget vestibulum dolor suscipit et. Donec sit amet nisi ac lacus finibus sollicitudin. Donec aliquet malesuada iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris placerat mi tincidunt libero mollis, vitae tempor arcu consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus tempus est lacus, sit amet vehicula enim dapibus dictum. Nam ultricies congue urna, non finibus odio placerat rhoncus. Sed dui dui, blandit et luctus vitae, lobortis a nulla. Mauris vel rhoncus odio, tempus pharetra odio. Aenean purus justo, dignissim in pellentesque lobortis, viverra nec erat. Nunc accumsan interdum eros a volutpat.
            <br/>
            {likes.length}
            {likes.filter(e => (e.localeCompare(user.username) === 0)).length === 0 && (
                <button
                    onClick={() => handleLike()}
                    className='btn btn-secondary mx-2'
                >
                    Like
                </button>
            )}
            {likes.filter(e => (e.localeCompare(user.username) === 0)).length > 0 && (
                <button
                    onClick={() => handleLike()}
                    className='btn btn-success mx-2'
                >
                    Unlike
                </button>
            )}
            <div class="container">
                <Form onSubmit={handleComment} ref={form} class="row align-items-center">
                    <div className="col-auto px-0">
                    <div onClick={() => navigate("/profile")} className="followingImg">
                        <img src="https://picsum.photos/id/64/200" alt="user img"/>
                    </div>    
                    </div>
                    <div class="col px-0">
                        <Input
                            type="text"
                            className="form-control search-query"
                            name="comment"
                            onChange={onChangeComment}
                            required
                        />
                    </div>
                    <div class="col-auto">
                    <button className="btn btn-success btn-block">Submit</button>
                    </div>
                </Form>
            </div>
            <div className="pb-5">hello</div>
        </div>
    );
};

export default PostPage;