import React from 'react'
// import * as z from "zod";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import FileUploader from '../shared/FileUploader';
import { PostValidation } from '../../lib/validation/SingUpSchma';
import { useUserContext } from "../../lib/context/authContext"
import { useCreatePost, useUpdatePost } from '../../lib/react-query/queryAndMutation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
function PostForm({ post, action }) {
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(',') : "",
    },
    mode: "onSubmit",
  });
  const navigate = useNavigate();
  const { user } = useUserContext()
  const { mutateAsync: createPost ,isPending:isCreateLoading } = useCreatePost();
  const { mutateAsync: updatePosts,isPending:isUpdateLoading } = useUpdatePost();

  const handleSubmit = async (data) => {
    try {
      if (post && action === "Update") {
        const updatePost = await updatePosts({ ...data, postId: post.$id, imageUrl: post.imageUrl, imageId: post.imageId });
        if (!updatePost) throw new Error("Failed to update post");
        toast.success("Post updated successfully!");
        return navigate(`/post/${post.$id}`);
      }

      const newPost = await createPost({
        ...data,
        userId: user.id
      })
      if (!newPost) throw new Error("Failed to create post");

      navigate('/')
    } catch (error) {
      console.log(error)
      throw new Error("Failed to create post error in the not created post")
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader FeildChange={field.onChange} MediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="file_uploader-box" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input {...field} type='text' className='shad-input' />
              </FormControl>
              <FormMessage className="file_uploader-box" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (comma-separated ",")</FormLabel>
              <FormControl>
                <Input {...field} type='text' className='shad-input' placeholder='JS,NEXTJS,React' />
              </FormControl>
              <FormMessage className="file_uploader-box" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isCreateLoading || isUpdateLoading}
          >
            {isCreateLoading || isUpdateLoading ? "Loading..." : post && action === "Update" ? "Update Post" : "Create Post"}
            
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm