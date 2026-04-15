import React, { useState } from 'react';
import { Settings, Grid, Bookmark, Tag } from 'lucide-react';
import { useGetProfilePosts, useGetUserById } from '../../lib/react-query/queryAndMutation';
import PostCard from '../../components/shared/PostCard';
import GridPostList from '../../components/shared/GridPostList';
import { Link } from 'react-router-dom';
import Saved from './Saved';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../../lib/context/authContext';
// import SavedPosts from './SavedPosts';   // ← Import SavedPosts

function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useUserContext()

  const { data: user } = useGetUserById(id)
  const { data: postsData, isLoading } = useGetProfilePosts(id);

  const [activeTab, setActiveTab] = useState('posts');
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>

  console.log(user)
  const posts = postsData?.documents || [];
  return (
    <div className="min-h-screen bg-[#09090A] max-w-[935px] mx-auto pb-20">
      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4 md:px-0">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-xl font-semibold text-light-1">{user.username}</h1>
          <Settings size={24} className="text-light-1" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
          {/* Profile Picture */}
          <div className="flex justify-center md:justify-start">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-700 p-1">
              <img
                src={user.imageUrl || "https://via.placeholder.com/300"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">

              {/* Mobile Header */}
              <div className="flex items-center justify-between md:hidden mb-4">
                <h1 className="text-2xl font-semibold text-light-1">
                  {user.name || "username"}
                </h1>
                <Settings size={26} className="cursor-pointer text-light-1" />
              </div>

              {/* Desktop Username */}
              <div className="hidden md:block">
                <h1 className="text-3xl font-light text-light-1">
                  {user.username || "username"}
                </h1>
              </div>

              {/* Buttons */}
              {
                user.$id == currentUser.id && (
                     <Link to={`/update-profile/${user.$id}`}>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                          <button className="flex-1 md:flex-none px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm text-light-1 transition">
                            Edit Profile
                          </button>
                      </div>
                     </Link>
                )

              }

            </div>

            {/* Stats */}
            <div className="flex justify-between md:justify-start md:gap-10 text-center md:text-left mb-6 text-light-1">
              <div>
                <div className="font-semibold text-lg">{posts?.length}</div>
                <div className="text-sm text-light-3">{posts.length === 1 ? 'post' : 'posts'}</div>
              </div>
              <div>
                <div className="font-semibold text-lg">12.4K</div>
                <div className="text-sm text-light-3">followers</div>
              </div>
              <div>
                <div className="font-semibold text-lg">892</div>
                <div className="text-sm text-light-3">following</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-5">
              <p className="font-semibold text-light-1">{user.name}</p>
              <p className="text-sm leading-tight text-light-2">
               {user?.bio|| "No bio"}
              </p>
            </div>

            {/* Highlights */}
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5">
                    <div className="w-full h-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full"></div>
                  </div>
                  <p className="text-xs mt-1 text-light-3">Story {i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800 sticky top-0 bg-[#09090A] z-10">
        <div className="flex justify-around md:justify-center md:gap-16 text-xs md:text-sm font-medium">
          <div
            className={`flex items-center justify-center gap-2 py-4 px-6 cursor-pointer transition ${activeTab === 'posts' ? 'border-t-2 border-white text-white' : 'text-light-3'
              }`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid size={20} />
            <span className="hidden md:inline">POSTS</span>
          </div>

          <div
            className={`flex items-center justify-center gap-2 py-4 px-6 cursor-pointer transition ${activeTab === 'saved' ? 'border-t-2 border-white text-white' : 'text-light-3'
              }`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={20} />
            <span className="hidden md:inline">SAVED</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-6 px-4">
            {isLoading ? (
              <p className="text-center text-light-3">Loading posts...</p>
            ) : posts.length > 0 ? (
              <GridPostList
                posts={posts}
                showUser={true}     // Hide user name in profile grid (cleaner)
                showStats={true}
              />
            ) : (
              <p className="text-center text-light-3 py-10">No posts yet</p>
            )}
          </div>
        )}

        {activeTab === 'saved' && <Saved savedPosts={[]} />}
      </div>
    </div>
  );
}

export default Profile;