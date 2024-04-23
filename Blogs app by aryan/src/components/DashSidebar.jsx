import { Sidebar, SidebarItemGroup } from 'flowbite-react'
import React from 'react'
import {HiUser,HiArrowSmRight,HiDocumentText,HiOutlineUserGroup, HiAnnotation, HiChartPie} from 'react-icons/hi'
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import {useDispatch,useSelector} from  'react-redux';

export default function DashSidebar() {
    const location=useLocation();
  const [tab,setTab]=useState('');
  const dispatch=useDispatch();
  const {currentUser}=useSelector((state)=>state.user);

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
   if(tabFromUrl){
    setTab(tabFromUrl);
   }
  },[location.search]);

  const handleSignout=async()=>{
    try{
      const res=await fetch('http://localhost:4000/api/user/signout',{
        method:'POST',
        credentials:'include',
      })
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signoutSuccess());
      }

    }
    catch(error){
      console.log(error.message);
    }
   }

  return (
    <Sidebar className='w-full md:w-56'>
    <Sidebar.Items>
      <SidebarItemGroup>

      {currentUser.IsAdmin && (
          <Link to='/dashboard?tab=dash'>
            <Sidebar.Item 
             
              icon={HiChartPie}
              as='div'
            >
              Dashboard
            </Sidebar.Item>
          </Link>
        )}




        <Link to='/dashboard?tab=profile'>
          <Sidebar.Item
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser.IsAdmin ? "Admin" : "User"}
            labelColor='dark'
            as='div'
          >
            Profile
          </Sidebar.Item>
        </Link>


    
        {currentUser.IsAdmin && (
          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item 
              active={tab === 'posts'}
              icon={HiDocumentText}
              as='div'
            >
              Posts
            </Sidebar.Item>
          </Link>
        )}

        
        {currentUser.IsAdmin && (
          <Link to='/dashboard?tab=users'>
            <Sidebar.Item 
              active={tab === 'users'}
              icon={HiOutlineUserGroup}
              as='div'
            >
              Users
            </Sidebar.Item>
          </Link>
        )}

           
{currentUser.IsAdmin && (
          <Link to='/dashboard?tab=comments'>
            <Sidebar.Item 
              active={tab === 'comments'}
              icon={HiAnnotation}
              as='div'
            >
              Comments
            </Sidebar.Item>
          </Link>
        )}
  
        <Sidebar.Item 
          icon={HiArrowSmRight} 
          className='cursor-pointer' 
          onClick={handleSignout}
        >
          Sign Out
        </Sidebar.Item>
      </SidebarItemGroup>
    </Sidebar.Items>
  </Sidebar>
  
  )
}
