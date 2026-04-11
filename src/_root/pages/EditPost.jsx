import React from 'react'
import PostForm from '../../components/form/PostForm'
import { useParams } from 'react-router-dom'
import { useGetPostById } from '../../lib/react-query/queryAndMutation';
import { Loader } from 'lucide-react';
function EditPost() {
  const {id} = useParams();
  const {data:post,isLoading:isPostLoading} = useGetPostById(id);
  
  if (isPostLoading) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
      {/* Example Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      {/* Optional Loading Text */}
      <p className="mt-4 text-sm text-gray-600 font-medium">Loading posts...</p>
    </div>
  );
}
  
  return (
      <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post}  />
      </div>
    </div>
  )
}

export default EditPost