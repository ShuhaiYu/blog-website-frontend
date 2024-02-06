import { Link } from "react-router-dom";
import lightPageNotFoundImg from "../imgs/404-light.png";
import darkPageNotFoundImg from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/full-logo-light.png";
import darkFullLogo from "../imgs/full-logo-dark.png";
import { useContext } from "react";
import { ThemeContext } from "../App";


const PageNotFound = () => {

    let{theme} = useContext(ThemeContext);
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src={theme==="light"?darkPageNotFoundImg:lightPageNotFoundImg} alt="404" className="select-none  w-72 aspect-square object-cover rounded" />
        
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>  
            <p className="text-dark-grey text-xl font-gelasio leading-7">The page you are looking for does not exist.</p>
            <p className="text-lg font-gelasio leading-7">Head back to the <Link to="/" className="text-black underline">home page</Link> </p>

            <div className="mt-auto">
                <img src={theme==="light"?darkFullLogo:lightFullLogo} className="h-8 object-contain block mx-auto select-none"></img>
                <p className="text-dark-grey text-lg font-gelasio leading-7 mt-5">Read millions of Stories around the world</p>
            </div>
        </section>
    )
}

export default PageNotFound;