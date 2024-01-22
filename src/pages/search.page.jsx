import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/inpage-navigation.component';
import { useState } from 'react';
import AnimatedPage from '../common/page-animation';
import BlogPostCard from '../components/blog-post.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import axios from 'axios';
import { filterPaginationData } from '../common/filter-pagination-data';
import UserCard from '../components/usercard.component';


const SearchPage = () => {
    let { query } = useParams();

    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/count-search-blogs",
                    data_to_send: { query },
                    create_new_arr
                });
                setBlogs(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const searchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        searchUsers();
    }, [query]);

    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    }

    const UserCardWrapper = ({ users }) => {
        return (
            <>
                {
                    users === null ? <Loader /> :
                        users.length === 0 ? <NoDataMessage message="No users found" /> :
                            users.map((user, i) => {
                                return (
                                    <AnimatedPage key={i} transition={{ duration: 1, delay: i * .1 }}>
                                        <UserCard user={user} />
                                    </AnimatedPage>
                                )
                            })
                }
            </>
        )
    }

    return (
        <section className='h-cover flex justify-center gap-10'>
            <div className='w-full'>
                <InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
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
                        <LoadMoreDataBtn state={blogs} fetchDataFunction={searchBlogs} />
                    </>

                    <UserCardWrapper users={users} />
                </InPageNavigation>
            </div>

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                <h1 className='text-xl font-medium mb-8'>
                    Users related to search <i className='fi fi-rr-user mt-1'></i>

                </h1>
                <UserCardWrapper users={users} />
            </div>
        </section>
    )
}

export default SearchPage