import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';


const CommentFeild = ({ action, index = undefined, replyingTo = undefined, setReplyFunc }) => {

    let { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, totalParentCommentsLoaded, setTotalParentCommentsLoaded } = useContext(BlogContext);

    let { userAuth: { username, access_token, fullname, profile_img } } = useContext(UserContext);

    const [comment, setComment] = useState('');

    const handleComment = () => {
        if (!access_token) {
            return toast.error('Please login to comment');
        }

        if (comment.trim() === '') {
            return toast.error('Comment cannot be empty');
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", { _id, blog_author, comment, replying_to: replyingTo }, { headers: { 'Authorization': `Bearer ${access_token}` } })
            .then(({ data }) => {
                setComment('');

                data.commented_by = { personal_info: { username, fullname, profile_img } };

                let newCommentArr;

                if (replyingTo) {
                    commentsArr[index].children.push(data._id);

                    data.childrenLevel = commentsArr[index].childrenLevel + 1;
                    data.parentIndex = index;

                    commentsArr[index].isReplyLoaded = true;

                    commentsArr.splice(index + 1, 0, data);

                    newCommentArr = commentsArr;
                    setReplyFunc(false);
                } else {

                    data.childrenLevel = 0;

                    newCommentArr = [data, ...commentsArr];
                }

                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                setBlog({ ...blog, comments: { ...comments, results: newCommentArr }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal } });
                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementVal);

                toast.success('Comment added successfully');
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong');
            });
    }

    return (
        <>
            <Toaster />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto">

            </textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                {action}
            </button>
        </>
    )
}

export default CommentFeild;