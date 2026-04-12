import {QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createAccount, createPost, currentUser, deletePost, deleteSave, getInfinitePosts, getPostPreview, getProfilePosts, getRecentPosts, getSavedPosts, likePost, SavePost, searchPosts, signInAccount, signOut, updatePost} from '../appwrite/api'
import { QUERY_KEYS } from './QueryKey';



export const useCreateAccount = () => {
    return useMutation({
        mutationFn:(data) => createAccount(data),
    })
}
/**
 * A hook that wraps `signInAccount` from `appwrite/api` in a `useMutation` hook.
 * This hook is used to sign in an account.
 * @returns {useMutation} A hook that wraps `signInAccount` in a `useMutation` hook.
 */
export const useSignInAccount = () => {
    return useMutation({
        mutationFn:(data) => signInAccount(data),
    })
}
export const useSignOut = () => {
    return useMutation({
        mutationFn:() => signOut(),
    })
}
export const useCreatePost = () => {
    const QueryClient = useQueryClient();
    return useMutation({
        mutationFn:(post) => createPost(post),
        onSuccess: () => {
            // Invalidate or refetch queries related to posts here if needed
            QueryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
                });
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts(),
    })
}
export const useGetProfilePosts = (userId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROFILE_POSTS,userId],
        queryFn: () => getProfilePosts(userId),
    })
}
export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({ postId, likeArray }) => likePost(postId,likeArray),        
        onSuccess: (data) => {
            // Invalidate or refetch queries related to posts here if needed
            queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id] 
                });
            queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
                });
            queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_POSTS] 
                });
            queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_CURRENT_USER] 
                });
        }
    })
}
export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({ postId, userId }) => SavePost(postId, userId),        
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS] 
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER] 
            });
            // ADD THIS LINE
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_SAVED_POSTS] 
            });
        }
    })
}

export const useDeleteSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(saveRecordId) => deleteSave(saveRecordId),        
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS] 
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER] 
            });
            // ADD THIS LINE
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_SAVED_POSTS] 
            });
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => currentUser(),
    })
}
export const useGetSavedPosts = (userId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
        queryFn: () => getSavedPosts(userId),
        enabled: !!userId,           // Only run when userId exists
    });
};

export const useGetPostById = (postId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostPreview(postId),
        enabled:!!postId
    })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post) => updatePost(post),
    onSuccess: (data) => {
      // 1. Update the specific post detail cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });

      // 2. Refresh the Home Feed (Recent Posts)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      // 3. Refresh general posts and infinite scrolls
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });

      // 4. Refresh saved posts so they reflect the new content
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
      });
    },
  });
};
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId,imageId}) => deletePost(postId,imageId),        
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
            });
        }
    })
}
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts ,
    getNextPageParam: (lastPage) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};