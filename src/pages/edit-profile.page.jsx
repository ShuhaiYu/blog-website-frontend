import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimatedPage from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import InputBox from "../components/input.component";
import { uploadImage } from "../common/aws";
import { storeInSession } from "../common/session";

const EditProfile = () => {

    let { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    let profileImgEle = useRef();
    let editProfileForm = useRef();

    const bioLimit = 150;

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [bioCharCount, setBioCharCount] = useState(bioLimit);
    const [uploadImg, setUploadImg] = useState(null);

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
                .then(({ data }) => {
                    setProfile(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
        , [access_token]);

    const handleBioCharChange = (e) => {
        setBioCharCount(bioLimit - e.target.value.length);
    }

    const handleImgPreview = (e) => {
        let img = e.target.files[0];

        profileImgEle.current.src = URL.createObjectURL(img);

        setUploadImg(img);
    }

    const handleImgUpload = (e) => {
        e.preventDefault();

        if (uploadImg) {
            let loadingToast = toast.loading("Uploading Image...");

            e.target.setAttribute("disabled", true);

            uploadImage(uploadImg)
                .then((url) => {
                    if (url) {
                        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
                            headers: {
                                "Authorization": `Bearer ${access_token}`
                            }
                        })
                            .then(({ data }) => {
                                let newUserAuth = { ...userAuth, profile_img: data.profile_img };
                                storeInSession("user", JSON.stringify(newUserAuth));
                                setUserAuth(newUserAuth);

                                setUploadImg(null);

                                toast.dismiss(loadingToast);
                                e.target.removeAttribute("disabled");
                                toast.success("Uploaded 👍");
                            })
                    }
                })
                .catch(({ response }) => {
                    toast.dismiss(loadingToast);
                    e.target.removeAttribute("disabled");
                    toast.error(response.data.message);

                })

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(editProfileForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        console.log(formData);

        let { username, bio, facebook, github, instagram, twitter, youtube, website } = formData;

        if (username.length < 3) {
            return toast.error("Username must be at least 3 characters long");
        }
        if (bio.length > bioLimit) {
            return toast.error(`Bio must be less than ${bioLimit} characters`);
        }

        let loadingToast = toast.loading("Updating Profile...");

        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            username, bio, social_links: { facebook, github, instagram, twitter, youtube, website }
        }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                if (data.username !== userAuth.username) {
                    let newUserAuth = { ...userAuth, username: data.username };
                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);

                }

                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Updated 👍");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.message);

            })

    }

    return (
        <AnimatedPage>
            {
                loading ?
                    <Loader /> :
                    <form ref={editProfileForm}>
                        <Toaster />
                        <h1 className="max-md:hidden">Edit Profile</h1>
                        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                            <div className="max-lg:center mb-5">
                                <label htmlFor="uploadImg" id="profileImgLable" className="rounded-full w-40 h-40 relative block bg-grey overflow-hidden" >
                                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/50 opacity-0 hover:opacity-100 cursor-pointer">
                                        Upload Image
                                    </div>
                                    <img ref={profileImgEle} src={profile_img} alt="profile" />
                                </label>

                                <input id="uploadImg" type="file" accept=".png, .jpeg, .jpg" className="hidden" onChange={handleImgPreview} />

                                <button onClick={handleImgUpload} className="btn-light mt-5 max-lg:center lg:w-full px-10">Upload</button>

                            </div>

                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                    <div>
                                        <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" icon="fi-rr-user" disable={true} />
                                    </div>
                                    <div>
                                        <InputBox name="email" type="text" value={email} placeholder="Email" icon="fi-rr-envelope" disable={true} />
                                    </div>
                                </div>
                                <InputBox name="username" type="text" value={profile_username} placeholder="Username" icon="fi-rr-at"/>

                                <p className="text-dark-grey -mt-3">
                                    Username will be used to search your profile and will be visible to everyone.
                                </p>

                                <textarea name="bio" maxLength={bioLimit} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" placeholder="Bio" defaultValue={bio} onChange={handleBioCharChange}></textarea>

                                <p className="text-dark-grey text-right mt-1">
                                    {bioCharCount} characters left
                                </p>

                                <p>Add your social links below </p>
                                <div className="md:grid md:grid-cols-2 gap-x-6">
                                    {
                                        Object.keys(social_links).map((social, index) => {
                                            let link = social_links[social];
                                            return (

                                                <InputBox key={index} name={social} type="text" value={link} placeholder="https://..." icon={"fi " + (social !== "website" ? "fi-brands-" + social : "fi-rr-globe")} />

                                            )

                                        })
                                    }
                                </div>

                                <button onClick={handleSubmit} className="btn-dark w-auto px-10" type="submit">Update</button>
                            </div>




                        </div>
                    </form>

            }
        </AnimatedPage >
    )
}

export default EditProfile