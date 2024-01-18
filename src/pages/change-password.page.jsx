
import React, { useContext, useRef } from "react";
import { UserContext } from "../App";
import AnimatedPage from "../common/page-animation";
import InputBox from "../components/input.component";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";



const ChangePassword = () => {
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const { userAuth: { access_token } } = useContext(UserContext);

    let ChangePasswordForm = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let form = new FormData(ChangePasswordForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword, confirmNewPassword } = formData;

        if (currentPassword === "" || newPassword === "" || confirmNewPassword === "") {
            return toast.error("Please fill all the fields");
        }

        if (newPassword !== confirmNewPassword) {
            return toast.error("New password and confirm password do not match");
        }

        if (currentPassword === newPassword) {
            return toast.error("New password cannot be same as current password");
        }

        if (!passwordRegex.test(newPassword)) {
            return toast.error("Password must contain atleast one uppercase, one lowercase and one digit and must be 6-20 characters long");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Changing password...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.success("Password changed successfully");
            })
            .catch(({response}) => {
                toast.dismiss(loadingToast);
                
                e.target.removeAttribute("disabled");
                return toast.error(response.data.message);
            })

    }

    return (
        <AnimatedPage>
            <Toaster />
            <form className="form" ref={ChangePasswordForm}>
                <h1 className="max-md:hidden">Change Password</h1>
                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox name="currentPassword" type="password" placeholder="Current Password" icon="fi-rr-unlock" />
                    <InputBox name="newPassword" type="password" placeholder="New Password" icon="fi-rr-unlock" />
                    <InputBox name="confirmNewPassword" type="password" placeholder="Confirm New Password" icon="fi-rr-unlock" />
                    <button className="btn-dark px-10" type="submit" onClick={handleSubmit}>Change Password</button>
                </div>
            </form>

        </AnimatedPage>

    )
}

export default ChangePassword;