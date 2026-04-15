import React from 'react';
import { useGetAllUser } from '../../lib/react-query/queryAndMutation';
import { Link } from 'react-router-dom';

const UserCardGrid = ({users}) => {
  



  return (
    <section className="min-h-screen bg-[#09090A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center sm:text-left border-b border-[#737373]/30 pb-8">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">Team Members</h2>
          <p className="mt-2 text-lg text-[#737373]">The core driving the vision forward.</p>
        </div>

        {/* Grid Logic */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users?.map((user) => (
            <div
              key={user.$id}
              className="group flex flex-col bg-[#1A1A1C] rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden hover:border-[#737373]/50 transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                  {/* Avatar with Link */}
                  <div className="relative">
                    <Link to={`/profile/${user.$id}`} className="block">
                      <img
                        className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 shadow-2xl"
                        src={user.imageUrl}
                        alt={user.name}
                      />
                    </Link>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                  </div>

                  <div className="flex-1 mt-4">
                    <h3 className="font-black text-white text-xl group-hover:text-[#737373] transition-colors tracking-tight">
                      {user.name}
                    </h3>
                    <p className="text-[#737373] text-[10px] font-black uppercase tracking-[0.2em] mt-1 bg-white/5 py-1 px-2 rounded-md inline-block">
                      {user.bio || "Member"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-center text-[#737373] text-xs mb-6 font-medium">
                    <svg className="w-3.5 h-3.5 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div
                    className="block w-full py-4 bg-[#737373] text-white text-center rounded-2xl text-xs font-black hover:bg-white hover:text-black shadow-lg shadow-black/50 transition-all duration-300 uppercase tracking-[0.1em]"

                  >
                    follow

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserCardGrid;
