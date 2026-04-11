import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useUserContext } from "../../lib/context/authContext";
import { useSignInAccount } from "../../lib/react-query/queryAndMutation";
import { SigninValidation } from "../../lib/validation/SingUpSchma";

const SigninForm = () => {

  const navigate = useNavigate();
  
  const { checkAuthUser,loading:isUserLoading } = useUserContext();
  
  const { mutateAsync: signInAccount, isPending:isLoading } = useSignInAccount();
  
  const form = useForm({
  
    resolver: zodResolver(SigninValidation),
  
    defaultValues: {
  
      email: "",
  
      password: "",
  
    },
  
  });

  const handleSignin = async (user) => {
  
    try {
  
      const SignUserData = await signInAccount(user);
      if(!SignUserData) throw new Error('No data returned from signInAccount');
  
      const CheckedLoggedUser = checkAuthUser();
  
      if(CheckedLoggedUser) {
        toast.success('Logged in successfully!');
        navigate('/')
  
      } else {
        throw new Error('User authentication failed after sign-in.');
  
      }
    } catch (error) {
      console.log('signin user problem in the signinForm.jsx',error)
  
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isLoading || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
