import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from '../shared/FileUploader';
import { UpdatePostValidation } from '../../lib/validation/SingUpSchma';
import { useGetUpdateProfile } from '../../lib/react-query/queryAndMutation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
function UpdateProfileForm({ post, action='Update' }) { // post -> user
  if(!post) return <Loader className="flex-center "/>;

  const form = useForm({
    resolver: zodResolver(UpdatePostValidation),
    defaultValues: {
      username: post ? post?.username : "",
      file: [],
      bio: post ? post?.bio : "no bio",
    },
    mode: "onSubmit",
  });
  const navigate = useNavigate();
  const { mutateAsync: updatePosts,isPending:isUpdateLoading } = useGetUpdateProfile();

  const handleSubmit = async (data) => {
    event.preventDefault()
    try {
      if (post && action === "Update") {
        const updatePost = await updatePosts({userId:post.$id,userProfileValues:{...data,imageId:post.imageId,imageUrl:post.imageUrl}});
        if (!updatePost) throw new Error("Failed to update post");
        toast.success("Post updated successfully!");
        return navigate(`/profile/${post.$id}`);
      }

      
    } catch (error) {
      console.log(error)
      throw new Error("Failed to create post error in the not created post")
    }
  }
  return (

    <Form {...form} >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Bio</FormLabel>
              <FormControl>
                <Input {...field} type='text' className='shad-input' />
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
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? "Loading..." : 'update Profile'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateProfileForm