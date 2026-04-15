import React from 'react'
import { useGetUserById } from '../../lib/react-query/queryAndMutation'
import { useParams } from 'react-router-dom'
import UpdateProfileForm from '../../components/form/UpdateProfileForm';

function UpdateProfile() {
  const {id} = useParams();
  const {data:user} = useGetUserById(id)
  console.log(user)
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Update Profile</h2>
        </div>

        <UpdateProfileForm action="Update" post={user}/>
      </div>
    </div>
  )
}

export default UpdateProfile