import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { SignupValidation } from "../../lib/validation/SingUpSchma";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useCreateAccount, useSignInAccount } from "../../lib/react-query/queryAndMutation";
import { toast } from "sonner";
import { useUserContext } from "../../lib/context/authContext";

export default function SignupForm() {
  const navigate = useNavigate();
  const {  checkAuthUser,loading:isUserLoading } = useUserContext();
  const {mutateAsync:createAccount,isPending:isLoading} = useCreateAccount();
  const {mutateAsync:signInAccount,isPending:isSigningInUser} = useSignInAccount();
  const form = useForm({
    resolver: zodResolver(SignupValidation),
    defaultValues: { username: "", name: "", email: "", password: "" },
  });

  async function onSubmit(data) {
      try {
          const res = await createAccount(data);
          if(!res) throw  toast.error("Account creation failed");
          const session = await signInAccount({email:data.email,password:data.password});
          if(!session) throw toast.error("Sign-in failed");
          // navigate("/sign-in"); not for now
          const isLoggedIn = await checkAuthUser();
          
        if (isLoggedIn) {
          toast.success("Account created successfully!");
          form.reset();

          navigate("/");
      } else {
        toast({ title: "Login failed. Please try again.", });
        
        return;
      }
      } catch (error) {
          toast.error(error.message?.includes("already exists") ? "User already exists" : "Failed to create account");
      } 
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use    Mamoongram, please enter your details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full mt-8">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="username" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="shad-button_primary w-full" disabled={isLoading}>
            {isLoading || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader className="animate-spin" /> Creating Account...
              </div>
            ) : "Create Account"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}