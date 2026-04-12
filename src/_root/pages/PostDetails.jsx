import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetPostById, useDeletePost } from '../../lib/react-query/queryAndMutation';
import { useUserContext } from '../../lib/context/authContext';
import PostState from '../../components/shared/PostState';
import { multiFormatDateString } from '../../lib/utils';
import { ArrowLeft, MoreHorizontal, Trash2 } from 'lucide-react';

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  
  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090A]">
        <p className="text-light-3">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20 text-light-3">Post not found</div>;
  }

  const isCreator = user.id === (post.creator?.$id || post.creator);

  const handleDelete = () => {
    if (window.confirm("Delete this post permanently?")) {
      deletePost(
        { postId: post.$id, imageId: post.imageId },
        { onSuccess: () => navigate('/') }
      );
    }
    setShowDeleteMenu(false);
  };

  return (
    <div className='w-full'>
      
    <div className="min-h-screen bg-[#09090A] pb-20">
      {/* Top Navigation - Mobile Friendly */}
      <div className="sticky top-0 bg-[#09090A] border-b border-dark-4 z-50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-light-2 hover:text-white">
          <ArrowLeft size={24} />
          <span className="font-medium">Back</span>
        </Link>

        {isCreator && (
          <div className="relative">
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="p-2"
            >
              <MoreHorizontal size={24} className="text-light-2" />
            </button>

            {showDeleteMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-dark-3 border border-dark-4 rounded-2xl shadow-2xl py-2 z-50">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-3 w-full px-5 py-3 text-red-500 hover:bg-dark-4 transition rounded-xl"
                >
                  <Trash2 size={20} />
                  <span className="font-medium">
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Image Section - Full width on mobile */}
        <div className="bg-black">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full max-h-[500px] md:max-h-[650px] object-contain mx-auto"
          />
        </div>

        {/* Content Section */}
        <div className="px-4 pt-4">
          
          {/* User Info */}
          <div className="flex items-center justify-between pb-4 border-b border-dark-4">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.creator?.$id || post.creator}`}>
                <img
                  src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-11 h-11 rounded-full object-cover border border-dark-4"
                />
              </Link>
              <div>
                <Link 
                  to={`/profile/${post.creator?.$id || post.creator}`}
                  className="font-semibold text-light-1 text-lg"
                >
                  {post.creator?.name || "Unknown"}
                </Link>
                {post.location && (
                  <p className="text-sm text-light-3">{post.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="py-5 border-b border-dark-4">
            <div className="flex gap-3">
              <img
                src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="creator"
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex-1">
                <p className="text-light-1 leading-relaxed">
                  <span className="font-semibold">{post.creator?.name}</span>{' '}
                  {post.caption}
                </p>
                <p className="text-xs text-light-3 mt-2">
                  {multiFormatDateString(post.$createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 py-5 border-b border-dark-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-primary-500 text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Like, Comment, Save Bar */}
          <div className="pt-4">
            <PostState post={post} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default PostDetails;