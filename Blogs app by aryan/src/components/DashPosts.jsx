import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useState } from 'react';
import {Table,Button,Modal} from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { Link } from 'react-router-dom';

const DashPosts = () => {

const {currentUser}=useSelector((state)=>state.user);
const [userPosts,setUserPosts]=useState([]);
const [showMore,setShowMore]=useState(true);
const [showModal,setShowModal]=useState(false);
const [postIdToDelete,setPostIdToDelete]=useState('');
console.log(userPosts);

useEffect(() => {
  const fetchPosts = async () => {
      try {
          if (currentUser && currentUser.IsAdmin) {
              const res = await fetch(`http://localhost:4000/api/post/getposts?userId=${currentUser._id}`, {
                  credentials: 'include',
              });
              console.log(res);
              const data = await res.json();
              if (res.ok) {
                  setUserPosts(data.posts);
                  if (data.posts.length < 9) {
                      setShowMore(false);
                  }
              }
          }
          
      } catch (error) {
          console.log(error.message);
      }
  }
  fetchPosts();


}, [currentUser]);


   const handleShowMore=async()=>{
    const startIndex=userPosts.length;
try{
  const res=await fetch(`http://localhost:4000/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,{
    credentials:'include',
  });
   const data= await res.json();
   if(res.ok){
    setUserPosts((prev)=>[...prev,...data.posts]);
    if(data.posts.length<9){
      setShowMore(false);
    }
   }
}
catch(error){
  console.log(error.message);

}


   }
   const handleDeletePost=async()=>{
    setShowModal(false);

    try{
      const res=await fetch(`http://localhost:4000/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
      method:'DELETE',
      credentials:'include',

      });
      const data= await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev)=>
        //means we want to filter all expect the deleted
        prev.filter((post)=>post._id!==postIdToDelete)

        );
      }


    }
    catch(error){
      console.log(error.message);

    }
    
   }

  



  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.IsAdmin && userPosts.length>0?(
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
        <Table.HeadCell>Data Updated</Table.HeadCell>
        <Table.HeadCell>Post Image</Table.HeadCell>
        <Table.HeadCell>Post Title</Table.HeadCell>
        <Table.HeadCell>Category</Table.HeadCell>
        <Table.HeadCell >Delete</Table.HeadCell>
        <Table.HeadCell>
          <span>Edit</span>
        </Table.HeadCell>
          </Table.Head>
          {userPosts.map((post)=>(
          <Table.Body className='divide-y'>
         <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
        <Table.Cell>
        {new Date(post.updatedAt).toLocaleDateString()}
        </Table.Cell>

        <Table.Cell>
       <Link to={`/post/${post.slug}`}>
          <img
          src={post.image}
          alt={post.title}
          className='w-20 h-10 object-cover bg-gray-500'
          />
       </Link>
        </Table.Cell>
          
          <Table.Cell>
           <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
           {post.title}
           </Link>
          </Table.Cell>

          <Table.Cell>{post.category}</Table.Cell>

          <Table.Cell>
            <span  className='font-md text-red-500 hover:underline cursor-pointer'
            onClick={()=>{
              setShowModal(true);
              setPostIdToDelete(post._id);
            }}
            
            >Delete</span>
          </Table.Cell>

          <Table.Cell>
            <Link to={`/update-post/${post._id}`} className='text-teal-500'>
            <span className='hover:underline'>Edit</span>

            </Link>
           
          </Table.Cell>





         </Table.Row>
          </Table.Body>

          ))
          }
        </Table>
        {
         showMore && (
          <Button className='w-full text-teal-800 self-center text-sm ' onClick={handleShowMore}>
            Show more
          </Button>
         )




        }
         </>
      ):(<p>There is no Posts Available</p>)
    
    
    
    }
    
 
    <Modal show={showModal}  onClose={()=>setShowModal(false)} popup size='md'>
     <Modal.Header/>

     <Modal.Body>
     <div className="text-center">
       <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
       <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this Post</h3>
       
       <div className='flex justify-center gap-x-7'>
   <Button color='failure' onClick={handleDeletePost}>Yes,I'm Sure</Button>
   <Button color='grey' onClick={()=>setShowModal(false)}>No</Button>



       </div>




     </div>





     </Modal.Body>




 



    </Modal>



    </div>
  )
}

export default DashPosts;
