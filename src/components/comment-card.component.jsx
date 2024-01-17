import { useContext, useState } from "react";
import { getFullDay } from "../common/date";
import { UserContext } from "../App";
import CommentFeild from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData;

    let { blog, blog: { comments, comments: { results: commentsArr }, activity, activity: { total_parent_comments }, author: { personal_info: { username: blog_author_username } } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);

    let { userAuth: { access_token, username } } = useContext(UserContext);

    const [isReply, setIsReply] = useState(false);

    const getParentIndex = () => {
        let startingPoint = index - 1;

        try {
            while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }
        }
        catch (err) {
            startingPoint = undefined;
        }

        return startingPoint;
    }

    const removeCommentsCard = (startingPoint, isDelete = false) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentsArr.splice(startingPoint, 1);
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        if (isDelete) {
            let parentIndex = getParentIndex();

            if (parentIndex !== undefined) {
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child !== _id);
                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArr.splice(index, 1);
        }

        if (commentData.childrenLevel === 0 && isDelete) {
            setTotalParentCommentsLoaded(preVal => preVal - 1);
        }

        setBlog({ ...blog, comments: { results: commentsArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel === 0 && isDelete ? 1 : 0) } })
    }


    const handleLoadReply = ({ skip = 0, currentIndex = index }) => {
        if (commentsArr[currentIndex].children.length) {
            handleHideReply();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id: commentsArr[currentIndex]._id, skip })
                .then(({ data: { replies } }) => {
                    commentsArr[currentIndex].isReplyLoaded = true;

                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;

                        commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
                    }

                    setBlog({ ...blog, comments: { ...comments, results: commentsArr } })
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }

    const handleDeleteComment = (e) => {

        e.target.setAttribute('disabled', true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id }, { headers: { 'Authorization': `Bearer ${access_token}` } })
            .then(() => {
                e.target.removeAttribute('disabled');

                removeCommentsCard(index + 1, true);

                toast.success('Comment deleted successfully');
            })
            .catch(err => {
                console.log(err);
            });
    }


    const handleReply = () => {
        if (!access_token) {
            return toast.error('Please login to reply');
        }
        setIsReply(preVal => !preVal);

    }

    const handleHideReply = () => {
        commentData.isReplyLoaded = false;

        removeCommentsCard(index + 1)
    }

    const LoadMoreReplyButton = () => {

        let parentIndex = getParentIndex();

        let button = <button className='flex items-center gap-2 text-dark-grey text-sm p-2 px-3 hover:bg-grey/30 rounded-md'
                        onClick={() => handleLoadReply({ skip: index - parentIndex, currentIndex: parentIndex })}>
                        <i className="fi fi-rr-comment"></i>
                        <span>Load more replies</span>
                    </button>

        if (commentsArr[index + 1]) {
            if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {
                if ((index - parentIndex) < commentsArr[parentIndex].children.length) {
                    return button;
                }
            }
        } else {
            if (parentIndex) {
                if ((index - parentIndex) < commentsArr[parentIndex].children.length) {
                    return button
                }
            }
        }
    }

    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex items-center gap-3 mb-8'>
                    <img src={profile_img} alt="" className='w-6 h-6 rounded-full' />

                    <p className='text-sm text-dark-grey line-clamp-1'>
                        {fullname} @{commented_by_username}
                    </p>
                    <p className="min-w-fit">{getFullDay(commentedAt)}</p>

                </div>

                <p className='font-gelasio text-xl ml-3'>
                    {comment}
                </p>

                <div className='flex items-center gap-5 mt-5'>

                    {
                        commentData.isReplyLoaded ?
                            <button className='flex items-center gap-2 text-dark-grey text-sm p-2 px-3 hover:bg-grey/30 rounded-md'
                                onClick={handleHideReply}>
                                <i className="fi fi-rr-comment"></i>
                                <span>Hide</span>
                            </button> :
                            <button className='flex items-center gap-2 text-dark-grey text-sm p-2 px-3 hover:bg-grey/30 rounded-md'
                                onClick={handleLoadReply}>
                                <i className="fi fi-rr-comment"></i>
                                <span>{children.length} Reply</span>
                            </button>
                    }
                    <button className='flex items-center gap-1 text-sm underline'
                        onClick={handleReply}>

                        <span>Reply</span>
                    </button>

                    {
                        username === commented_by_username || username === blog_author_username ?
                            <button className='flex items-center p-2 px-3 rounded-md ml-auto hover:bg-red/30 hover:text-red'
                                onClick={handleDeleteComment}>
                                <i className="fi fi-rr-trash pointer-events-none"></i>

                            </button> : null
                    }
                </div>

                {
                    isReply ?
                        <div className='mt-8'>
                            <CommentFeild action={"reply"} index={index} replyingTo={_id} setReplyFunc={setIsReply} />
                        </div> : null
                }


            </div>

            <LoadMoreReplyButton />

        </div>
    )
}

export default CommentCard