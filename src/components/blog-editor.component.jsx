import { Link, useNavigate, useParams } from 'react-router-dom';
import lightLogo from '../imgs/logo-light.png';
import darkLogo from '../imgs/logo-dark.png';
import AnimatedPage from '../common/page-animation';
import lightDefaultBanner from '../imgs/blog banner light.png';
import darkDefaultBanner from '../imgs/blog banner dark.png';
import { uploadImage } from '../common/aws';
import { useContext, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './tools.component';
import axios from 'axios';
import { UserContext, ThemeContext } from '../App';


const BlogEditor = () => {


    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    let { userAuth: { access_token } } = useContext(UserContext);
    let { theme } = useContext(ThemeContext);
    let { blog_id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: 'textEditor',
                data: Array.isArray(content) ? content[0] : content,
                tools: EDITOR_JS_TOOLS,
                placeholder: "Start writing your blog here...",
            }))
        }
    }, []);

    const handleBannerUpload = (e) => {

        let img = e.target.files[0];

        if (img) {
            let loadingToast = toast.loading("Uploading...");
            uploadImage(img)
                .then(url => {
                    if (url) {

                        toast.dismiss(loadingToast);
                        toast.success("Uploaded! 👍");


                        setBlog({ ...blog, banner: url });
                    }
                })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    toast.error("Upload failed 😢");
                    toast.error(err.message);
                })
        }
    }

    const handleTitleKeyDone = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    }

    const handleTitleChange = (e) => {
        // Auto resize textarea
        let input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value });
    }

    const handleError = (e) => {
        let img = e.target;
        img.src = theme === "light" ? lightDefaultBanner : darkDefaultBanner;
    }

    const handlePublish = () => {
        if (title === "") {
            toast.error("Title is required!");
            return;
        }
        if (banner === "") {
            toast.error("Banner is required!");
            return;
        }
        if (textEditor.isReady) {
            textEditor.save()
                .then((outputData) => {
                    if (outputData.blocks.length) {
                        setBlog({ ...blog, content: outputData });
                        setEditorState("publish")
                        toast.success("Saved! 👍");
                    } else {
                        toast.error("Content is required!");
                        return;
                    }
                })
                .catch((error) => {
                    console.log('Saving failed: ', error)
                });
        }
    }

    const handleSaveDraft = (e) => {
        if (e.target.disabled) return;

        if (!title.length) {
            toast.error("Write blog title to save as draft");
            return;
        }

        let loadingToast = toast.loading("Saving Draft...");

        e.target.disabled = true;

        if (textEditor.isReady) {
            textEditor.save().then((content) => {
                let blog = {
                    title,
                    banner,
                    content,
                    tags,
                    des,
                    draft: true,
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blog, blog_id },
                    {
                        headers: { Authorization: `Bearer ${access_token}` }
                    })
                    .then(() => {
                        e.target.disabled = false;
                        toast.dismiss(loadingToast);
                        toast.success("Saved! 👍");

                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=drafts");
                        }, 500);

                    })
                    .catch(({ response }) => {
                        e.target.disabled = false;
                        toast.dismiss(loadingToast);
                        toast.error(response.data.message);
                    })
            })
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link className="flex-none w-10" to="/">
                    <img src={theme === "light" ? darkLogo : lightLogo} alt="logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {
                        title === "" ? "New Blog" : title
                    }
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublish}>Publish</button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>Save</button>
                </div>
            </nav>
            <Toaster />
            <AnimatedPage>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video bg-white border-4 border-grey'>
                            <label htmlFor='uploadBanner'>
                                <img src={banner} className='z-20' onError={handleError} />
                                <input id='uploadBanner' type='file' accept='.png, .jpg, .jpeg' hidden
                                    onChange={handleBannerUpload} />
                            </label>
                        </div>

                        <textarea
                            defaultValue={title}
                            placeholder='Blog Title'
                            className='w-full h-20 text-4xl font-medium outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                            onKeyDown={handleTitleKeyDone}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className='my-5 w-full opacity-10' />

                        <div id="textEditor" className='font-gelasio'>

                        </div>
                    </div>
                </section>
            </AnimatedPage>
        </>
    )
}

export default BlogEditor;