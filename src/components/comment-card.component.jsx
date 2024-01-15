import { getFullDay } from "../common/date";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment } = commentData;

    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex items-center gap-3 mb-8'>
                    <img src={profile_img} alt="" className='w-6 h-6 rounded-full' />


                    <p className='text-sm text-dark-grey line-clamp-1'>
                        {fullname} @{username}
                    </p>
                    <p className="min-w-fit">{getFullDay(commentedAt)}</p>

                </div>

                <p className='font-gelasio text-xl ml-3'>
                    {comment}
                </p>

                <div className='flex items-center gap-3 mt-8'>
                    <button className='flex items-center gap-1 text-dark-grey text-sm'>
                        <i className="fi fi-rr-comment"></i>
                        <span>Reply</span>
                    </button>
                    <button className='flex items-center gap-1 text-dark-grey text-sm'>
                        <i className="fi fi-rr-heart"></i>
                        <span>Like</span>
                    </button>

                </div>


            </div>

        </div>
    )
}

export default CommentCard