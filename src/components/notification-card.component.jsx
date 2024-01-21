import { Link } from "react-router-dom"

const NotificationCard = ({ data, index, notificationState }) => {

    let { type, user: { personal_info: { profile_img, fullname, username } } } = data
    return (
        <div className="p-6 border-b border-grey border-l-black ">
            <div className="flex gap-5 mb-3">
                <img src={profile_img} className="w-14 h-14 rounded-full flex-none" />
                <div className="w-full">
                    <h1 className="font-medium text-xl text-dark-grey">
                        <span className="lg:inline-block hidden capitalize">{fullname}</span>
                        <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
                        <span className="font-normal">
                            {
                                type === "like" ?
                                    "liked your blog"
                                    :
                                    type === "comment" ?
                                        "commented on "
                                        :
                                        "replied on"
                            }
                        </span>
                    </h1>



                </div>

            </div>

        </div>
    )
}

export default NotificationCard