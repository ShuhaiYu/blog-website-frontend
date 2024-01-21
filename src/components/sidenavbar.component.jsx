import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../App'



const SideNavbar = () => {
    let { userAuth: { access_token, new_notification_available } } = useContext(UserContext);

    let page = location.pathname.split("/")[2]; //page name

    let [pageState, setPageState] = useState(page.replace("-", " ")); //page state
    let [showSidebar, setShowSidebar] = useState(false); //sidebar state

    let activeTabLine = useRef();
    let sidebarIcon = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {
        let tab = e.target.innerText;
        let tabWidth = e.target.offsetWidth;
        let tabLeft = e.target.offsetLeft;

        activeTabLine.current.style.width = `${tabWidth}px`;
        activeTabLine.current.style.left = `${tabLeft}px`;

        if (e.target === sidebarIcon.current) {
            setShowSidebar(true);
        }
        else {
            setShowSidebar(false);
        }
    }

    useEffect(() => {
        setShowSidebar(false);
        pageStateTab.current.click();

    }, [pageState]);

    return (
        access_token === null ? <Navigate to={"/signin"} /> :
            <>
                <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
                    <div className="sticky top-[80px] z-30">

                        <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
                            <button ref={sidebarIcon} className="p-5 capitalize" onClick={changePageState}>
                                <i className="fi fi-rr-menu-burger pointer-events-none"></i>
                            </button>
                            <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                                {pageState}
                            </button>
                            <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />
                        </div>

                        <div className={'min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ' + (showSidebar ? "opacity-100 pointer-events-auto" : "max-md:opacity-0 max-md:pointer-events-none")}>
                            <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                            <hr className='border-grey -ml-6 mb-8 mr-6' />

                            <NavLink to="/dashboard/blogs" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-document"></i>
                                <span>Blogs</span>
                            </NavLink>

                            <NavLink to="/dashboard/notifications" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <div className='relative'>
                                    <i className="fi fi-rr-bell"></i>
                                    {
                                        new_notification_available ?
                                            <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                                            :
                                            null
                                    }
                                </div>

                                <span>Notifications</span>
                            </NavLink>

                            <NavLink to="/editor" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-file-edit"></i>
                                <span>Write</span>
                            </NavLink>

                            <h1 className="text-xl text-dark-grey mb-3 mt-20">Settings</h1>
                            <hr className='border-grey -ml-6 mb-8 mr-6' />

                            <NavLink to="/settings/edit-profile" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-user"></i>
                                <span>Edit Profile</span>
                            </NavLink>

                            <NavLink to="/settings/change-password" className="sidebar-link" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-lock"></i>
                                <span>Change Password</span>
                            </NavLink>

                        </div>
                    </div>

                    <div className="max-md:-mt-8 mt-5 w-full">
                        <Outlet />
                    </div>

                </section>




            </>
    )
}

export default SideNavbar