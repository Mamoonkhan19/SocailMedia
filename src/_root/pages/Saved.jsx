import {  useGetSavedPosts } from '../../lib/react-query/queryAndMutation';
import PostCard from '../../components/shared/PostCard';
import Loader from '../../components/shared/Loader';
import { useUserContext } from '../../lib/context/authContext';

function Saved() {
    const { user } = useUserContext();
    const { data: savedPosts = [], isLoading } = useGetSavedPosts(user?.id);
    if (isLoading) return <Loader />;

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold mb-8">Bookmarks</h2>

                    {savedPosts.length === 0 ? (
                        <div className="flex-center flex-col h-[60vh]">
                            <img src="/assets/icons/saved.svg" className="w-20 opacity-40" />
                            <p className="text-light-3 mt-6">No saved posts yet</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col items-center w-full gap-9 p-2">
                            {savedPosts.map((post) => (
                                <PostCard key={post.$id} post={post}  isBookmarkPage={true}/>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Saved;