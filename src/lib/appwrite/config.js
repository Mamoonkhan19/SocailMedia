import { Client,Avatars,Storage,Account,Databases } from "appwrite";

export const appwriteConfig = {
    url:String( import.meta.env.VITE_APPWRITE_API_URL),
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID

};

const client = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);
export const account   = new Account  (client);
export const storage   = new Storage  (client);
export const avatars   = new Avatars  (client);
export const databases  = new Databases (client,);