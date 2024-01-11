import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimatedPage from '../common/page-animation';
import Loader from '../components/loader.component';
import { UserContext } from '../App';
import AboutUser from '../components/about.component';
import { fillterPaginationData } from '../common/filter-pagination-data';
import InPageNavigation from '../components/inpage-navigation.component';
import BlogPostCard from '../components/blog-post.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import PageNotFound from './404.page';


export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        bio: "",
        profile_img: ""
    },
    social_links: {},
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    joinedAt: " "
}

const ProfilePage = () => {

    let { id: profileId } = useParams();


    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, social_links, account_info: { total_posts, total_reads }, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext);

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
            .then(({ data: user }) => {
                if (user !== null) {
                    setProfile(user);
                };
                setProfileLoaded(profileId);
                fetchUserBlogs({ user_id: user._id });
                setLoading(false);
            })
            .catch(err => {
                console.log(err) 
                setLoading(false);
            });
    }

    const fetchUserBlogs = ({ page = 1, user_id }) => {
        user_id = user_id === undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { page, author: user_id })
            .then(async ({ data }) => {
                let formatedData = await fillterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/count-search-blogs",
                    data_to_send: { author: user_id }
                });

                formatedData.user_id = user_id;
                setBlogs(formatedData);
            })
            .catch(err => {
                console.log(err) 
                setLoading(false);
            });
    }

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (blogs === null) {
            resetStates();
            fetchUserProfile();
        }

    }, [profileId, blogs]);

    const resetStates = () => {
        setProfile(profileDataStructure);
        setBlogs(null);
        setProfileLoaded("");
        setLoading(true);
    }


    return (
        <AnimatedPage>
            {
                loading ? <Loader /> :
                    profile_username.length ?
                        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md: border-l border-grey md:sticky md:top-[100px] md:py-10">
                                <img src={profile_img} alt="profile" className="w-48 h-48 rounded-full bg-grey md:w-32 md:h-32" />
                                <h1 className="text-2xl font-bold">@{profile_username}</h1>
                                <p className="text-xl font-medium capitalize h-6">{fullname}</p>

                                <p className="text-lg font-medium">{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                                <div className="flex mt-2 gap-4">
                                    {
                                        profileId === username ?
                                            <Link to="settings/edit-profile" className="btn-light rounded-md">
                                                Edit Profile
                                            </Link>
                                            : " "
                                    }
                                </div>

                                <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                            </div>

                            <div className="w-full max-md:mt-12">
                                <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>

                                    <>
                                        {
                                            blogs === null ? <Loader /> :
                                                (
                                                    blogs.results.length === 0 ? <NoDataMessage message="No blogs found" /> :
                                                        blogs.results.map((blog, i) => {
                                                            return (
                                                                <AnimatedPage key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                                    <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                                </AnimatedPage>

                                                            )
                                                        })
                                                )
                                        }
                                        <LoadMoreDataBtn state={blogs} fetchDataFunction={fetchUserBlogs} />
                                    </>

                                    <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                                </InPageNavigation>
                            </div>

                        </section>
                        : <PageNotFound />



            }

        </AnimatedPage>

    )
}

export default ProfilePage