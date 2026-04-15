import React from 'react'
import UserCardGrid from '../../components/shared/UserCardGrid'
import Loader from '../../components/shared/Loader'
import { useGetAllUser } from '../../lib/react-query/queryAndMutation';

function AllUser() {
  
    const { data: users, isLoading } = useGetAllUser();
    if(isLoading) return <Loader />
  return (
    <div>
      <UserCardGrid users={users.documents}/>
    </div>
  )
}

export default AllUser