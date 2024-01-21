import { useEffect, useState } from "react";
import AnimatedPage from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import MinimalBlogPostCard from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";


const HomePage = () => {

    let [blogs, setblogs] = useState(null);

    let [trendingBlogs, settrendingBlogs] = useState(null);
    let [pageState, setpageState] = useState("home");

    let catagories = [
        "technology",
        "health",
        "sports",
        "entertainment",
        "business",
        "education",
        "travel",
        "food",
        "lifestyle",
        "fashion",
        "movies",
        "animals",
        "gaming",
        "1",
        "test"
    ];

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/count-latest-blogs"
                });


                setblogs(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchBlogsByCatagory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {


                let formatedData = await fillterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/count-search-blogs",
                    data_to_send: { tag: pageState }
                });


                setblogs(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
                settrendingBlogs(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setblogs(null);

        if (category === pageState) {
            setpageState("home");
            return
        }
        // else {
        //     fetchBlogsByCatagory({ page: 1});
        // }
        setpageState(category);
    }

    useEffect(() => {
        activeTabRef.current.click();

        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCatagory({ page: 1 });
        }
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

    }, [pageState]);

    return (
        <AnimatedPage>
            <section className="h-cover flex justify-center gap-10">
                {/* latest posts */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending pages"]} defaultHidden={["trending pages"]}>

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
                            <LoadMoreDataBtn state={blogs} fetchDataFunction={(pageState === "home" ? fetchLatestBlogs : fetchBlogsByCatagory)} />
                        </>

                        {
                            trendingBlogs === null ? <Loader /> :
                                (
                                    trendingBlogs.length === 0 ? <NoDataMessage message="No trending blogs" /> :
                                        trendingBlogs.map((blog, i) => {
                                            return (
                                                <AnimatedPage key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <MinimalBlogPostCard blog={blog} index={i} />
                                                </AnimatedPage>

                                            )
                                        })
                                )


                        }
                    </InPageNavigation>

                </div>


                {/* popular posts */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-xl font-medium mb-8">Stories from all interests</h1>
                            <div className="flex gap-3 flex-wrap">
                                {
                                    catagories.map((category, i) => {
                                        return (
                                            <button onClick={loadBlogByCategory} key={i} className={"tag " + (pageState === category ? " bg-black text-white" : "")}>{category}</button>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-xl font-medium mb-8">Trending
                            <i className="fi fi-rr-arrow-trend-up"></i>
                        </h1>

                        {
                            trendingBlogs === null ? <Loader /> :
                                (
                                    trendingBlogs.length === 0 ? <NoDataMessage message="No trending blogs" /> :
                                        trendingBlogs.map((blog, i) => {
                                            return (
                                                <AnimatedPage key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <MinimalBlogPostCard blog={blog} index={i} />
                                                </AnimatedPage>

                                            )
                                        })
                                )


                        }
                    </div>
                </div>

            </section>

        </AnimatedPage>
    )
}

export default HomePage;