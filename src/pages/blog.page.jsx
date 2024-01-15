import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import AnimatedPage from '../common/page-animation';
import Loader from '../components/loader.component';
import { getFormattedDate } from '../common/date';
import BlogInteraction from '../components/blog-interaction.component';
import BlogPostCard from '../components/blog-post.component';
import BlogContent from '../components/blog-content.component';
import CommentContainer from '../components/comments.component';
import { fetchComments } from '../components/comments.component';

export const blogDataStructure = {
    title: "",
    content: [],
    banner: "",
    des: "",
    author: {
        personal_info: {
            fullname: "",
            username: "",
            profile_img: ""
        }
    },
    publishedAt: ""
}

export const BlogContext = createContext({});

const BlogPage = () => {

    let { blog_id } = useParams();
    const [blog, setBlog] = useState(blogDataStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isliked, setIsliked] = useState(false);
    const [commentWrapper, setCommentWrapper] = useState(true);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    let { title, content, banner, des, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => {

                blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded });
                setBlog(blog);

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 3, eliminate_blog: blog_id })
                    .then(({ data }) => {
                        setSimilarBlogs(data.blogs);
                    })
                    .catch(err => console.log(err));


                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        resetState();
        fetchBlog();
    }, [blog_id]);

    const resetState = () => {
        setBlog(blogDataStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setIsliked(false);
        setCommentWrapper(true);
        setTotalParentCommentsLoaded(0);
    }



    return (
        <AnimatedPage>
            {
                loading ? <Loader /> :
                    <BlogContext.Provider value={{ blog, setBlog, isliked, setIsliked, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>

                        <CommentContainer />
                        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                            <img src={banner} alt="" className="aspect-video" />
                            <div className="mt-12">
                                <h2>{title}</h2>

                                <div className="flex max-sm:flex-col justify-between my-8">
                                    <div className='flex gap-5 items-start'>
                                        <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />

                                        <p className="text-dark-grey capitalize">{fullname}<br />@
                                            <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                        </p>
                                    </div>
                                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml:12 max-sm:pl-5">Published on {getFormattedDate(publishedAt)}</p>
                                </div>
                            </div>

                            <BlogInteraction />

                            <div className="my-12 font-gelasio blog-page-content">
                                {
                                    content[0].blocks.map((block, index) => {
                                        return (

                                            <div key={index} className='my-4 md:my-8' >
                                                <BlogContent block={block} />
                                            </div>
                                        )


                                        //     <div key={index} className="my-5">
                                        //         {

                                        //             // block.type === "header" ?
                                        //             //     <h1 className="text-2xl">{block.data.text}</h1> :
                                        //             //     block.type === "paragraph" ?
                                        //             //         <p className="text-dark-grey">{block.data.text}</p> :
                                        //             //         block.type === "image" ?
                                        //             //             <img src={block.data.file.url} alt="" className="w-full" /> :
                                        //             //             block.type === "list" ?
                                        //             //                 <ul className="list-disc list-inside">
                                        //             //                     {
                                        //             //                         block.data.items.map((item, index) => {
                                        //             //                             return (
                                        //             //                                 <li key={index} className="text-dark-grey">{item}</li>
                                        //             //                             )
                                        //             //                         })
                                        //             //                     }
                                        //             //                 </ul> :
                                        //             //                 block.type === "quote" ?
                                        //             //                     <blockquote className="text-dark-grey">{block.data.text}</blockquote> :
                                        //             //                     null
                                        //         }
                                        //     </div>
                                        // )

                                    })
                                }
                            </div>


                            <BlogInteraction />

                            {
                                similarBlogs !== null && similarBlogs.length > 0 ?
                                    <>
                                        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>

                                        {
                                            similarBlogs.map((blog, index) => {
                                                let { author: { personal_info } } = blog;
                                                return (
                                                    <AnimatedPage key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                                                        <BlogPostCard content={blog} author={personal_info} />
                                                    </AnimatedPage>
                                                )
                                            })
                                        }

                                    </> : null
                            }

                        </div>
                    </BlogContext.Provider>

            }
        </AnimatedPage>
    )
}

export default BlogPage