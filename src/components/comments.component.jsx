import React, { useContext, useEffect } from 'react';
import { BlogContext } from '../pages/blog.page';
import CommentFeild from './comment-field.component';
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimatedPage from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {

    let res;

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
        .then(({ data }) => {
            data.map(comment => {
                comment.childrenLevel = 0;
            });

            setParentCommentCountFun(preVal => preVal + data.length);

            if (comment_array === null) {
                res = { results: data };
            } else {
                res = { results: [...comment_array, ...data] };
            }



        })
        .catch(err => {
            console.log(err);
        });
    return res;
}

const CommentContainer = () => {

    let { blog, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded,setBlog } = useContext(BlogContext)
    console.log(commentsArr);

    const loadMoreComments = async () => {
        let newCommentArr = await fetchComments({ skip: totalParentCommentsLoaded, blog_id:_id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_array: commentsArr });

        setBlog({ ...blog, comments: newCommentArr })

    }
    return (
        <div className={"max-sm:w-full fixed " + (commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>
            <div className='relative'>
                <h1 className='text-xl font-medium'>
                    Comments
                </h1>
                <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
                    {title}
                </p>

                <button className='absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center bg-grey/80'

                    onClick={() => setCommentWrapper(preVal => !preVal)}>
                    <i className={"fi fi-br-cross text-2xl mt-1"}></i>
                </button>
            </div>

            <hr className='border-grey my-8 w-[120%] -ml-10' />

            <CommentFeild action={"comment"} />

            {
                commentsArr && commentsArr.length ?
                    commentsArr.map((comment, i) => {
                        return <AnimatedPage key={i}>
                            <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                        </AnimatedPage>
                    }) : <NoDataMessage message='No comments yet' />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                    <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={loadMoreComments}>
                        Load more
                    </button> : null
            }

        </div>
    )

}

export default CommentContainer;