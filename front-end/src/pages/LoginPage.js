import React, { useState, useRef, useEffect } from 'react';
import Form from "react-validation/build/form";
import {useAuth} from '../AuthContext';


function LoginPage() {
    const form = useRef();
    const {user, setUser} = useAuth();
    const {auth, setAuth} = useAuth();
    
    const handleLogin = (e) => {
        e.preventDefault();

        //form.current.validateAll();
        setAuth(true);
        setUser("Chewy the Dog");
    };

    return (
        <div>
            Login Page
            <Form onSubmit={handleLogin} ref={form}>
                <div className="form-group">
                    <button className="btn btn-outline-success btn-block mt-3 mb-4">Login</button>
                </div>
            </Form>
        </div>
    )
}

export default LoginPage;