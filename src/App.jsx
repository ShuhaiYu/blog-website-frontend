import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import React, { createContext, useEffect, useState } from 'react';
import { getFromSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = getFromSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
    }
    , []);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path="/" element={<Navbar />} >
                    <Route path="/signin" element={<UserAuthForm type={"signin"} />} />
                    <Route path="/signup" element={<UserAuthForm type={"signup"} />} />
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </UserContext.Provider>



    )
}

export default App;