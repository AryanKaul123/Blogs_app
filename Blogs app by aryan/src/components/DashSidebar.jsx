import { Sidebar, SidebarItemGroup } from 'flowbite-react'
import React from 'react'
import {HiUser,HiArrowSmRight} from 'react-icons/hi'
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DashSidebar() {
    const location=useLocation();
  const [tab,setTab]=useState('');

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
   if(tabFromUrl){
    setTab(tabFromUrl);
   }
  },[location.search]);
  return (
    <Sidebar className='w-full md:w-56 '>
       
    <Sidebar.Items>
   <SidebarItemGroup>
   <Link to='/dashboard?tab=profile'>
    <Sidebar.Item active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark'>
        Profile
    </Sidebar.Item>
    </Link>

    <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' >
      Sign Out
    </Sidebar.Item>

   </SidebarItemGroup>
 





    </Sidebar.Items>






      
    </Sidebar>
  )
}
