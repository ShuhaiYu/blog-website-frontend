import React, { useContext } from 'react';
import InputBox from "../components/input.component";
import { Link, Navigate } from "react-router-dom";
import googleIcon from "../imgs/google.png";
import AnimatedPage from "../common/page-animation";
import {toast, Toaster} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from '../common/firebase';


const UserAuthForm = ({ type }) => {

    let {userAuth:  {access_token}  , setUserAuth} = useContext(UserContext);

    const userAuthThroughServer = async (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({data}) => {
            storeInSession("user", JSON.stringify(data));
            
            setUserAuth(data);
        })
        .catch(({response}) => {
            toast.error(response.data.message);
        }
        )
    }

    const handleFormSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type === "signin" ? "/signin" : "/signup";

        let form = new FormData(authForm);

        let formData = {}

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        // form validation
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        
        console.log("Email being tested:", email);
        if (email === "" || password === "") {
            return toast.error("Please fill in all the fields")
        }
        if (!emailRegex.test(email)) {
            return toast.error('Please enter a valid email')           
        }
        if (!passwordRegex.test(password)) {
            return toast.error('Password must be 6-20 characters, contain at least one digit, one lowercase, and one uppercase letter')
        }

        userAuthThroughServer(serverRoute, formData);
    }

    const handleGoogleAuth = async (e) => {
        e.preventDefault();

        authWithGoogle().then((user) => {
            let serverRoute = "/google-auth";;
            if (user) {
                let formData = {
                    access_token: user.accessToken,
                }
                userAuthThroughServer(serverRoute, formData);
            }
        }).catch((error) => {
            toast.error(error.message);
            console.log(error);
        })
    }

    return (
        access_token ?
        <Navigate to="/" /> 
        :
        <AnimatedPage keyValue={type}>
            <section className="flex h-cover items-center justify-center">
                <Toaster />

                <form id="authForm" className="w-[80%] max-w-[400px]" onSubmit={handleFormSubmit}>

                    <h1 className="text-4xl font-gelasio mb-24 text-center capitalize">{type === "signin" ? "Welcome Back" : "Join Us Today"}</h1>

                    {
                        type === "signup" &&
                        <InputBox name="fullname" type="text" id="fullname" placeholder="Full Name" icon="fi-rr-user" />
                    }
                    <InputBox name="email" type="email" id="email" placeholder="Email" icon="fi-rr-envelope" />
                    <InputBox name="password" type="password" id="password" placeholder="Password" icon="fi-rr-lock" />

                    <button type="submit" className="btn-dark center mt-14">
                        {type === "signin" ? "Sign In" : "Sign Up"}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>OR</p>
                        <hr className="w-1/2 border-black" />

                    </div>

                    <button className="btn-light flex items-center justify-center gap-4 w-[90%] center"
                    onClick={handleGoogleAuth}>
                        <img src={googleIcon} alt="google icon" className="w-6 h-6" />
                        continue with google
                    </button>

                    {
                        type === "signin" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black texl-xl ml-1">
                                    Join us today
                                </Link>
                            </p> :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already have an account?
                                <Link to="/signin" className="underline text-black texl-xl ml-1">
                                    Sign in here
                                </Link>
                            </p>
                    }

                </form>
            </section>
        </AnimatedPage>
    )
}

export default UserAuthForm;