import React, { useContext } from 'react';
import { EditorContext } from '../pages/editor.pages';

const Tag = ({ tag, tagIndex }) => {

    let { blog, blog:{ tags }, setBlog } = useContext(EditorContext);

    const handleTagDelete = () => {
        setBlog({ ...blog, tags: blog.tags.filter(t => t !== tag) });
    }

    const handleTagEdit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();

            let newTag = e.target.innerText;
            tags[tagIndex] = newTag;

            setBlog({ ...blog, tags: tags });
            e.target.contentEditable = false;
        }
    }

    const addEditable = (e) => {
        e.target.contentEditable = true;
        e.target.focus();
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none" onClick={addEditable} onKeyDown={handleTagEdit} contentEditable="true">{tag}</p>
            <button className="absolute right-2 top-1/2 mt-[2px] rounded-full -translate-y-1/2"
            onClick={handleTagDelete}>
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    );
}

export default Tag;