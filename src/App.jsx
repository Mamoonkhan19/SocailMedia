import {
   AllUsers,
   CreatePost, 
   Home, 
    PostDetails, 
   Profile, 
   UpdateProfile 
  } from './_root/pages/index'
  import Explore from './_root/pages/Explore'
import { 
    Route, 
    Routes 
  } from 'react-router-dom'
import EditPost from './_root/pages/EditPost'
import SinginForm from './_auth/forms/SigninForm'
import SingupForm from './_auth/forms/SingupForm'
import { Toaster } from '@/components/ui/sonner'   // ← Important
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import Saved from './_root/pages/Saved'

function App() {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public route */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SingupForm />} />
          <Route path="/sign-in" element={<SinginForm />} />
        </Route>

        {/* private route */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path = "/saved"              element = {<Saved />} />
          <Route path = "/explore"            element = {<Explore />} />
          <Route path = "/all-users"          element = {<AllUsers />} />
          <Route path="/post/:postId" element={<PostDetails />} /> 
          <Route path = "/profile/:id/*"      element = {<Profile />} />
          <Route path = "/create-post"        element = {<CreatePost />} />
          <Route path = "/update-post/:id"    element = {<EditPost />} />
          <Route path = "/update-profile/:id" element = {<UpdateProfile />} />
        </Route>



      </Routes>

      <Toaster />   {/* Sonner Toaster */}
    </main>
  );
}

export default App
