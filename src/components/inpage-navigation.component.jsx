import React, { useEffect, useRef, useState } from 'react';


const InPageNavigation = ({routes, defaultHidden = [], defaultActiveIndex = 0, children}) => {

    let activeTabLineRef = useRef();
    let activeTabRef = useRef();

    let [InPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        let {offsetLeft, offsetWidth} = btn;
        activeTabLineRef.current.style.left = offsetLeft + "px";
        activeTabLineRef.current.style.width = offsetWidth + "px";
        setInPageNavIndex(i);
    }

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex)
    }, []);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, i) => {
                        return (
                            <button 
                            ref={i === defaultActiveIndex ? activeTabRef : null} 
                            key={i} 
                            className={"p-4 px-5 capitalize " + (InPageNavIndex === i ? "text-black " : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : "")}
                            onClick={(e) => {changePageState(e.target, i)}}>
                                {route}
                                
                            </button>
                        )
                    })
                }

                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300'/>
            </div>

            {Array.isArray(children) ? children[InPageNavIndex] : children}
        </>

    )
}

export default InPageNavigation;