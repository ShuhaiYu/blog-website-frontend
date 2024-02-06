import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import { filterPaginationData } from '../common/filter-pagination-data';
import { Toaster } from 'react-hot-toast';
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import AnimatedPage from '../common/page-animation';
import { ManagePublishedBlogsCard, ManageDraftsCard } from '../components/manage-blogcard.component';
import LoadMoreDataBtn from '../components/load-more.component';
import { useSearchParams } from 'react-router-dom';

const ManageBlogs = () => {
    let { userAuth: { access_token } } = useContext(UserContext);
    let activeTab = useSearchParams()[0].get("tab");


    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", {
            page, draft, deletedDocCount, query
        }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/user-written-blogs-count",
                    data_to_send: { draft, query },
                    user: access_token
                });

                console.log(formattedData);

                draft ? setDrafts(formattedData) : setBlogs(formattedData);

            })
            .catch((err) => {
                console.log(err);
            })

    }

    const handleChange = (e) => {
        if (!e.target.value.length) {
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }
    }

    const handleSearch = (e) => {
        setQuery(e.target.value);

        if (e.target.length && e.keyCode === 13) {
            setBlogs(null);
            setDrafts(null);
            getBlogs({ page: 1, draft: false });
            getBlogs({ page: 1, draft: true });
        }
    }


    useEffect(() => {
        if (access_token) {
            if (blogs === null) {
                getBlogs({ page: 1, draft: false });
            }
            if (drafts === null) {
                getBlogs({ page: 1, draft: true });
            }
        }
    }, [access_token, query, drafts, blogs]);

    return (
        <>

            <h1 className='max-md:hidden'>Manage Blogs</h1>

            <Toaster />

            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input type="search" placeholder="Search blogs" className="w-full bg-grey p-4 pl-12 pr-12 rounded-full placeholder:text-dark-grey" onChange={handleChange} onKeyDown={handleSearch} />
                <i className="fi fi-rr-search absolute top-4 right-[10%] md:left-4 md:pointer-events-none text-dark-grey "></i>
            </div>

            <InPageNavigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={activeTab !== "drafts" ? 0 : 1}>
                {
                    blogs === null ? <Loader /> :
                        blogs.results.length ?
                            <>
                                {
                                    blogs.results.map((blog, index) => {
                                        return <AnimatedPage key={index} transition={{ delay: index * 0.04 }}>
                                            <ManagePublishedBlogsCard blog={{ ...blog, index: index, setStateFunc: setBlogs }} />

                                        </AnimatedPage>
                                    })
                                }
                                <LoadMoreDataBtn state={blogs} fetchDataFunction={getBlogs} additionalParam={{ draft: false, deletedDocCount: blogs.deletedDocCount }} />
                            </>



                            : <NoDataMessage message="No blogs found" />
                }


                {
                    drafts === null ? <Loader /> :
                        drafts.results.length ?
                            <>
                                {
                                    drafts.results.map((blog, index) => {
                                        return <AnimatedPage key={index} transition={{ delay: index * 0.04 }}>
                                            <ManageDraftsCard blog={{ ...blog, index: index, setStateFunc: setDrafts }} />

                                        </AnimatedPage>
                                    })
                                }
                                <LoadMoreDataBtn state={drafts} fetchDataFunction={getBlogs} additionalParam={{ draft: true, deletedDocCount: drafts.deletedDocCount }} />

                            </>

                            : <NoDataMessage message="No drafts found" />
                }

            </InPageNavigation>



        </>

    )
}

export default ManageBlogs;