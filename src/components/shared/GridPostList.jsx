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

  if (!posts || posts.length === 0) {
    return <p className="text-light-3 text-center py-10">No posts yet</p>;
  }

  return (
    <ul className="grid grid-cols-3 gap-1 md:gap-4 px-1 md:px-0">
      {posts.map((post) => (
        <li key={post.$id} className="relative aspect-square group overflow-hidden rounded-xl bg-dark-2">
          
          {/* Post Image */}
          <Link to={`/posts/${post.$id}`} className="w-full h-full">
            <img
              src={post.imageUrl}
              alt="post"
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Overlay on Hover (Desktop) + Bottom Info */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-end p-3">
            <div className="flex justify-between items-center w-full text-white">
              {showStats && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart size={18} fill="white" />
                    <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">0</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Show stats at bottom always */}
          {showStats && (
            <div className="absolute bottom-2 right-2 md:hidden">
              <PostState post={post} userId={user.id} />
            </div>
          )}

          {/* User Info (optional) */}
          {showUser && (
            <div className="absolute bottom-2 left-2 hidden md:flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full">
              <img
                src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="creator"
                className="w-6 h-6 rounded-full object-cover"
              />
              <p className="text-xs text-white line-clamp-1 max-w-[100px]">
                {post.creator?.name}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;