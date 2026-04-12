import React, { useEffect, useState } from 'react';
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from '../../lib/react-query/queryAndMutation';
import Loader from './Loader';

function PostState({ post, userId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(post?.likes || []);

  const { mutateAsync: likePost, isPending: isLikePending } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavePending } = useSavePost();
  const { mutateAsync: deleteSave, isPending: isDeletePending } = useDeleteSavePost();
  
  const { data: currentUser } = useGetCurrentUser();

  // Check if post is saved
  useEffect(() => {
    if (currentUser?.save && post) {
      const isPostSaved = currentUser.save.some(
        (record) => record.post?.$id === post.$id
      );
      setIsSaved(isPostSaved);
    }
  }, [currentUser, post]);

  const handleLikePost = (e) => {
    e.stopPropagation();
    let newLikes = [...likes];

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter(id => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likeArray: newLikes });
  };

  const handleSavePost = (e) => {
    e.stopPropagation();

    if (!currentUser) return;

    const alreadySaved = currentUser.save?.some(
      (record) => record.post?.$id === post.$id
    );

    if (alreadySaved) {
      const saveRecord = currentUser.save.find(
        (record) => record.post?.$id === post.$id
      );
      deleteSave(saveRecord.$id);
      setIsSaved(false);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20 mt-2">
      {/* Like Section */}
      <div className="flex gap-2 mr-5">
        {isLikePending ? (
          <Loader />
        ) : (
          <img
            src={
              likes.includes(userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className="cursor-pointer"
          />
        )}
        <p className="small-medium lg:base-medium text-light-1">
          {likes.length}
        </p>
      </div>

      {/* Save Section */}
      <div className="flex gap-2">
        {(isSavePending || isDeletePending) ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
}

export default PostState;