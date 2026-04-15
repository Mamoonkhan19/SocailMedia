import { Link } from 'react-router-dom';
import { useUserContext } from '../../lib/context/authContext';
import PostStats from '../shared/PostState';
import { multiFormatDateString } from '../../lib/utils';

function PostCard({ post}) {

    const { user } = useUserContext();
    return (
        <div className="post-card">
  {/* 1. HEADER: User info and Edit button */}
  <div className=" flex justify-between items-center p-4">
    <div className="flex items-center gap-3">
      <Link to={`/profile/${post?.creator?.$id}`}>
        <img
          src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
        />
      </Link>

      <div className="flex flex-col p-1">
        <p className="base-medium lg:body-bold text-light-1">
          {post.creator.name}
        </p>
        <div className="flex items-center gap-2 text-light-3">
          <p className="subtle-semibold lg:small-regular">
            {multiFormatDateString(post.$createdAt)}
          </p>
          {post.location && (
            <>
              <span className="text-[10px]">•</span>
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </>
          )}
        </div>
      </div>
    </div>

    <Link
      to={`/update-post/${post.$id}`}
      className={`${user.id !== post.creator.$id && "hidden"}`}
    >
      <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
    </Link>
  </div>

  {/* 2. MAIN IMAGE: Full width */}
  <Link to={`/posts/${post.$id}`}>
    <img
      src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
      alt="post image"
      className="post-card_img"
    />
  </Link>

  {/* 3. STATS & CAPTION: Below the image */}
  <div className="px-4 pb-4">
    <PostStats post={post} userId={user.id} />

    <div className="mt-3">
      <p className="small-medium lg:base-medium text-light-1">
        <span className="font-bold mr-2">{post.creator.name}</span>
        {post.caption}
      </p>
      <ul className="flex flex-wrap gap-1 mt-1">
        {post.tags.map((tag, index) => (
          <li key={`${tag}${index}`} className="text-primary-500 subtle-semibold lg:small-regular">
            #{tag}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
    )
}

export default PostCard;