import { useEffect, useState } from "react";
import AnimatedPage from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";


const HomePage = () => {

    let [blogs, setblogs] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
            .then(({ data }) => {
                setblogs(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        fetchLatestBlogs();
    }, []);
    return (
        <AnimatedPage>
            <section className="h-cover flex justify-center gap-10">
                {/* latest posts */}
                <div className="w-full">
                    <InPageNavigation routes={["home", "trending pages"]} defaultHidden={["trending pages"]}>

                        <>
                            {
                                blogs === null ? <Loader/> : 
                                blogs.map((blog, i) => {
                                    return (
                                        <AnimatedPage key={i} transition={{duration: 1, delay: i*.1}}>
                                            <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                        </AnimatedPage>

                                    )
                                })

                            }

                        </>

                        <h1>Trending </h1>
                    </InPageNavigation>

                </div>


                {/* popular posts */}
                <div>
                    <h1>popular posts</h1>
                </div>

            </section>

        </AnimatedPage>
    )
}

export default HomePage;