import Loader from "../../components/shared/Loader"
import React from 'react'
import { useGetRecentPosts } from "../../lib/react-query/queryAndMutation";
import PostCard from "../../components/shared/PostCard";

function Home() {
  const { data: post, isPending:isPostLoading } = useGetRecentPosts();
  return (
      <div className="flex flex-1">
        <p>In the home page </p>
         <div className="home-container">
          <div className="home-posts">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            {isPostLoading && !post ?
              <Loader />
              :
               <ul className="flex flex-col items-center w-full gap-9">
                {post?.documents?.map((post) => (
                  <PostCard key={post.$id} post={post} />
                ))}
               </ul>

            }
          </div>
         </div>
      </div>
  )
}

export default Home