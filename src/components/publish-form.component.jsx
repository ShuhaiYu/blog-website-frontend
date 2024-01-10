import AnimatedPage from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {

    let characterLimit = 200;
    let tagLimit = 5;

    let { blog, blog: { title, banner, content, tags, des }, setEditorState, setBlog } = useContext(EditorContext);
    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogTitleChange = (e) => {
        setBlog({ ...blog, title: e.target.value });
    }

    const handleBlogDesChange = (e) => {
        if (e.target.value.length <= characterLimit) {
            setBlog({ ...blog, des: e.target.value });
        } else {
            toast.error("Description can't be more than 200 characters");
        }
    }

    const handleTitleKeyDone = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    }

    const handleKeyDone = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();

            let tag = e.target.value.trim();

            if (tag.length > 0) {
                if (tags.length < tagLimit && !tags.includes(tag)) {
                    setBlog({ ...blog, tags: [...tags, tag] });
                } else {
                    toast.error("You can't add more than 5 tags");
                }
            } else {
                toast.error("Tag can't be empty");
            }

            e.target.value = "";
            
        }
    }

    const publishBlog = (e) => {
        if (e.target.disabled) return;

        if (!title.length) {
            toast.error("Title can't be empty");
            return;
        }
        if (!des.length || des.length > characterLimit) {
            toast.error("Description can't be empty or more than 200 characters");
            return;
        }

        if (!tags.length) {
            toast.error("Add at least one tag to rank your blog");
            return;
        }


        let loadingToast = toast.loading("Publishing...");

        e.target.disabled = true;

        let blog = {    
            title,
            banner,
            content,
            tags,
            des,
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blog, 
        {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        .then(() => {
            e.target.disabled = false;
            toast.dismiss(loadingToast);
            toast.success("Published! 👍");
            
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } )
        .catch(({response}) => {
            e.target.disabled = false;
            toast.dismiss(loadingToast);
            toast.error(response.data.message);
        })
       

    }

    return (
        <AnimatedPage>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="banner" />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>

                    <input type="text"
                        className="input-box pl-4"
                        placeholder="Blog Title"
                        defaultValue={title}
                        onChange={handleBlogTitleChange} />

                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>

                    <textarea className="input-box pl-4 h-40 resize-none leading-7"
                        placeholder="Description"
                        defaultValue={des}
                        maxLength={characterLimit}
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDone}>

                    </textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - (helps ... )</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" placeholder="Topic" 
                        onKeyDown={handleKeyDone}/>
                        {
                            tags.map((tag, index) => {
                                return <Tag key={index} tag={tag} tagIndex={index}/>
                            })
                        }
                        


                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-right">{ tagLimit - tags.length } Tags left</p>

                    <button className="btn-dark px-8" onClick={publishBlog}>Publish</button>

                </div>
            </section>
        </AnimatedPage>
    )
}

export default PublishForm;