import { Link } from "react-router-dom";
import { useUserContext } from '../../lib/context/authContext';
import PostState from './PostState';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';


const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <Link to={`/profile/${post.creator.$id}`}>
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                  />
                <p className="line-clamp-1">{post.creator.name}</p>
              </Link>
              </div>
            )}
            {showStats && <PostState post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
