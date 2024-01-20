import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
    console.log(social_links);
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl font-medium leading-7">{bio.length ? bio : "Nothing to read here"}</p>
            <div className="flex flex-col mt-5 gap-3">

                <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                    {
                        Object.keys(social_links).map((key, index) => {

                            let link = social_links[key];

                            return (
                                link ? <Link to={link} key={index} target="_blank" className="flex items-center gap-2 ">
                                    <i className={"fi " + (key !== "website" ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"} />
                                </Link> : " "

                            )
                        })
                    }
                </div>

                <p className="text-xl leading-7 text-dark-grey">
                    Joined on {getFullDay(joinedAt)}
                </p>
            </div>
        </div>
    )
}

export default AboutUser

