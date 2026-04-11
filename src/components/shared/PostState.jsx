import React, { useEffect, useState } from 'react'
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from '../../lib/react-query/queryAndMutation'
import Loader from './Loader';


function PostState({ post, userId }) {
  const [isSaved, setIsSaved] = useState(false)
  const likeList = post?.likes?.map((user) => 
    typeof user === 'string' ? user : user.$id
)
const [likes, setlikes] = useState(likeList);
const { mutateAsync: likePost, isPending: isLikePending } = useLikePost()
const { mutateAsync: SavePost, isPending: isSavePending } = useSavePost()
const { mutateAsync: deleteSave, isPending: isDeletePending } = useDeleteSavePost()
const { data: currentUser } = useGetCurrentUser()

useEffect(() => {
// Check if currentUser exists and has a save array
if (currentUser && post) {
  // Look for the post ID string in the save records
  const saved = currentUser.save.find((record) => record.post.$id === post.$id);
  
  // Set state to true if found (using !! converts the object/undefined to boolean)
  setIsSaved(!!saved);
}
}, [currentUser, post]); 

  const handleLikePost = (e) => {
    e.stopPropagation()
    let newLikes = [...likes];
    const hasLiked = newLikes.find( id => id === userId);
    if(hasLiked){
      newLikes = newLikes.filter(id => id !== userId)
    }
    else{
      newLikes.push(userId)
    }
    setlikes(newLikes);
    likePost({postId:post.$id,likeArray:newLikes});
  }
const handleSavePost = (e) => {
    e.stopPropagation();

    const alreadySaved = currentUser?.save?.some(record => record.post.$id === post.$id);

    if (alreadySaved) {
        const saveRecord = currentUser.save.find(record => record.post.$id === post.$id);
        deleteSave(saveRecord.$id);
        setIsSaved(false)
    } else {
        SavePost({ postId: post.$id, userId: userId });
        setIsSaved(true);
    }
};
  const checkedIsLiked = (likes, userId) => {
    return likes?.find(id => id === userId)
  }
  return (
    <div
      className={`flex justify-between items-center z-20 mt-2`}>
      <div className="flex gap-2 mr-5">
        {
          isLikePending?<Loader/>:
          <img
          src={
            checkedIsLiked(likes, userId)
            ? "/assets/icons/liked.svg"
            : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
          />
        }
        <p className="small-medium lg:base-medium">{likes.length||''}</p>
      </div>

      <div className="flex gap-2">
        {isSavePending||isDeletePending?<Loader/>:<img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSavePost}
        />}
      </div>
    </div>
  )
}

export default PostState