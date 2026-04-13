import { ID, Query } from "appwrite"
import { account, appwriteConfig, avatars, databases, storage } from "./config"

export async function createAccount(user) {
    try {
        // Step 1: Create Auth Account
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw new Error("Account creation failed")

        // Step 2: Generate avatar URL
        const avatarUrl = avatars.getInitials(user.name)

        // Step 3: Save User to Database (Important fix here)
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser

    } catch (error) {
        console.error("Error in createAccount:", error)

        // Re-throw the error so it can be caught in your form
        throw error
    }
}

export async function signInAccount(user) {
    try {
        // Step 1: Sign In Account
        const session = await account.createEmailPasswordSession(
            user.email,
            user.password,
        )

        if (!session) throw new Error("Sign-in failed")

        // Step 2: Get User Details

        // Step 3: Save User to Database (Important fix here)


        return session

    } catch (error) {
        console.error("Error in signInAccount:", error)

        // Re-throw the error so it can be caught in your form
        throw error
    }
}

async function saveUserToDB(user) {
    try {
        const savedUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.accountId,           // ← Use accountId as Document ID (Best Practice)
            {
                accountId: user.accountId,
                name: user.name,
                email: user.email,
                username: user.username,
                imageUrl: user.imageUrl,
                // You can add more fields later: bio, followers, etc.
            }
        )

        return savedUser

    } catch (error) {
        console.error("Error in saveUserToDB:", error)
        throw error
    }
}

export async function currentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("No authenticated user found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            'users',
            [
                Query.equal("accountId", currentAccount.$id),
                Query.select([
                    '*',
                    'save.*',
                    'save.post.*',
                    'save.post.creator.*',     // Expand creator
                    'save.post.creator.imageUrl',
                    'save.post.creator.name',
                    'save.post.creator.username'
                ])
            ]
        );

        return currentUser.documents[0];
    } catch (error) {
        console.error("Error in currentUser:", error);
        throw error;
    }
}

export async function signOut() {
    try {
        await account.deleteSession("current")
    } catch (error) {
        console.error("Error in signOut:", error)
        throw new Error("Failed to sign out")
    }
}
export async function createPost(post) {
    try {
        if (!post.file || post.file.length === 0) throw new Error("File is required");
        // 1. Upload the file
        const uploadedFile = await fileUpload(post.file[0]); // Pass the single file object here
        if (!uploadedFile) throw new Error("File upload failed");
        const fileUrl = await FilePreview(uploadedFile.$id);
        if (!fileUrl) {
            // If post creation fails, delete the uploaded file to avoid orphaned files
            await deleteFile(uploadedFile.$id);
            throw new Error("Post creation failed");
        }

        const tags = post.tags
            ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
            : [];
        const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, ID.unique(),
            {
                caption: post.caption,
                location: post.location,
                imageUrl: fileUrl, // Store the file URL returned from the fileUrl
                imageId: uploadedFile.$id, // Store the file ID or URL returned from the upload
                creator: post.userId, // Assuming you have the user ID in the post object
                tags: tags || [], // Optional: Add tags if you have them

            })
        return newPost
    } catch (error) {
        console.error("Error in createPost:", error);
        throw error;
    }
}
export async function updatePost(post) {
    const hasFileUpdate = post.file && post.file.length > 0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }
        if (hasFileUpdate) {
            if (!post.file || post.file.length === 0) throw new Error("File is required");
            // 1. Upload the file
            const uploadedFile = await fileUpload(post.file[0]); // Pass the single file object here
            if (!uploadedFile) throw new Error("File upload failed");
            const fileUrl = await FilePreview(uploadedFile.$id);
            if (!fileUrl) {
                // If post creation fails, delete the uploaded file to avoid orphaned files
                await deleteFile(uploadedFile.$id);
                throw new Error("Post creation failed");
            }
            image = {
                ...image,
                imageUrl: fileUrl, // Store the file URL returned from the fileUrl
                imageId: uploadedFile.$id, // Store the file ID or URL returned from the upload
            }
        }
        const tags = post.tags
            ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
            : [];
        const updatePost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, post.postId,
            {
                caption: post.caption,
                location: post.location,
                imageUrl: image.imageUrl, // Store the file URL returned from the fileUrl
                imageId: image.imageId, // Store the file ID or URL returned from the upload
                creator: post.userId, // Assuming you have the user ID in the post object
                tags: tags || [], // Optional: Add tags if you have them

            })

        if (!updatePost) {
            deleteFile(image.imageId);
            throw new Error("Post creation failed");
        }

        return updatePost
    } catch (error) {
        console.error("Error in createPost:", error);
        throw error;
    }
}
export async function deletePost(postId,imageId) {
    console.log(postId,imageId)
    if(!postId||!imageId) throw new Error("PostId and imageId are required");
    try {
        const fileDeletion = await deleteFile(imageId);
        if (!fileDeletion) throw new Error("Failed to delete associated file");
        const deletes = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, postId);
        return deletes
    } catch (error) {
        console.log(error)
        throw new Error("Failed to delete post");
    }
}
export async function fileUpload(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file // Pass the single file object here
        );
        return uploadedFile;
    } catch (error) {
        console.error("Error in fileUpload:", error);
        throw error;
    }
}
export async function FilePreview(fileId) {
    try {
        const file = await storage.getFileView(appwriteConfig.storageId, fileId);
        return file;
    } catch (error) {
        console.error("Error in FilePreview:", error);
        throw error;
    }
}

export async function deleteFile(fileid) {
    try {
        return await storage.deleteFile(appwriteConfig.storageId, fileid);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete file");
    }
}

export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            'post',                    // or appwriteConfig.postsCollectionId
            [
                Query.orderDesc("$createdAt"),
                Query.limit(30),
                Query.select([
                    '*',
                    'creator.*',           // This is already working
                    'likes.*'              // ← Add this (or whatever your relation key is)
                ])

            ]
        );

        return posts;
    } catch (error) {
        console.error("Error in getRecentPosts:", error);
        throw error;
    }
}
export async function getProfilePosts(userId) {
  if (!userId) throw new Error("User ID is required");

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId || 'post',   // Use config if possible
      [
        Query.orderDesc("$createdAt"),
        Query.limit(30),
        Query.equal("creator", userId),
        Query.select([
          '*',
          'creator.*',
          'creator.imageUrl',
          'creator.name',
          'creator.username',
          'likes.*',           // ← Better to use this if likes is a relation
        ])
      ]
    );

    return posts;
  } catch (error) {
    console.error("Error in getProfilePosts:", error);
    throw error;
  }
}
export async function likePost(postId, likeArray) {
    console.log(postId)
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            'post',
            postId,
            {
                likes: Array.isArray(likeArray) ? likeArray : [likeArray]
            }
        )
        if (!updatedPost) throw new Error("Post creation failed");
        return updatedPost
    }
    catch (error) {
        console.error("Error in likePost:", error);
        throw error;
    }
}
export async function SavePost(postId, userId) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )
        if (!updatedPost) throw new Error("Post creation failed");
        return updatedPost
    }
    catch (error) {
        console.error("Error in likePost:", error);
        throw error;
    }
}
export async function deleteSave(saveRecordId) {
    try {
        const updatedPost = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            saveRecordId,

        )
        if (!updatedPost) throw new Error("Post creation failed");
        return updatedPost
    }
    catch (error) {
        console.error("Error in likePost:", error);
        throw error;
    }
}
export async function getSavedPosts(userId) {
    try {
        if (!userId) throw new Error("User ID is required");

        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [
                Query.equal("user", userId),           // ← Fixed: Use correct field name
                Query.orderDesc("$createdAt"),         // Show recently saved first
                Query.limit(50),
                Query.select([
                    '*',
                    'post.*',
                    'post.creator.*',
                    'post.likes.*',
                    'post.creator.imageUrl',
                    'post.creator.name',
                    'post.creator.username',
                    'post.imageUrl',
                    'post.caption',
                    'post.location',
                    'post.tags'
                ])
            ]
        );

        // Return only the post documents (cleaner for UI)
        return savedPosts.documents.map(save => save.post).filter(Boolean);

    } catch (error) {
        console.error("Error in getSavedPosts:", error);
        throw new Error("Failed to get saved posts");
    }
}

export async function getPostPreview(postIdToBePreviewd) {

    try {

        const response = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postIdToBePreviewd,
            [Query.select([
                '*',
                'creator.*',           // This is already working
                'likes.*'              // ← Add this (or whatever your relation key is)
            ])]
        )
        if (!response) throw new Error("Post creation failed");
        return response;
    }
    catch (error) {
        console.log('an error is occured in getPostPreview :=>>>>> ', error)
    }
}

export async function searchPosts(searchTerm) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9),  Query.select([
                    '*',
                    'creator.*',           // This is already working
                    'likes.'              // ← Add this (or whatever your relation key is)
                ])];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
