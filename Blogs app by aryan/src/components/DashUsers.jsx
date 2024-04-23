import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useState } from 'react';
import {Table,Button,Modal} from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck,FaTimes} from 'react-icons/fa'



const DashUsers = () => {

const {currentUser}=useSelector((state)=>state.user);
const [users,setUsers]=useState([]);
const [showMore,setShowMore]=useState(true);
const [showModal,setShowModal]=useState(false);
const [userIdToDelete,setUserIdToDelete]=useState('');
console.log(users);

   useEffect(()=>{
    const fetchUsers=async()=>{
        try{
          const res = await fetch(`http://localhost:4000/api/user/getusers`, {
            credentials: 'include'
        });
        console.log(res);
            const data=await res.json()
            console.log(data);
            if(res.ok){
                setUsers(data.users);
                if(data.users.length<9){
                  setShowMore(false);
                }

            
            }

        }
        catch(error){
            console.log(error.message);

        }
    };
    console.log(currentUser);
    if(currentUser.IsAdmin){
        fetchUsers();
    }
   },[currentUser._id]);

   const handleShowMore = async () => {
    const startIndex = users.length;
    try {
        const res = await fetch(`http://localhost:4000/api/user/getusers?startIndex=${startIndex}`, {
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => [...prev, ...data.users]);
            if (data.users.length < 9) {
                setShowMore(false);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

//   handle delete later

  const handleDeleteUser=async()=>{
    try{
    const res=await fetch(`http://localhost:4000/api/user/delete/${userIdToDelete}`,{
      method:'DELETE',
      credentials:'include',
    })
    const data=await res.json();
    if(res.ok){
      setUsers((prev)=>prev.filter((user)=>user._id!==userIdToDelete));
      setShowModal(false);
    }
    else{
    console.log(data.message);
    }

    }
    catch(error){
     console.log(error.message);
    }

  };



  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.IsAdmin && users.length>0?(
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
        <Table.HeadCell>Data created</Table.HeadCell>
        <Table.HeadCell>User Image</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Admin</Table.HeadCell>
        <Table.HeadCell >Delete</Table.HeadCell>
        
          </Table.Head>
          {users.map((user)=>(
          <Table.Body className='divide-y' key={user._id}>
         <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
        <Table.Cell>
        {new Date(user.createdAt).toLocaleDateString()}
        </Table.Cell>

        <Table.Cell>
      
          <img
          src={user.profilePicture}
          alt={user.username}
          className='w-20 h-10 object-cover bg-gray-500'
          />
      
        </Table.Cell>
          
          <Table.Cell>
        
           {user.username}
          
          </Table.Cell>

          <Table.Cell>{user.email}</Table.Cell>
       <Table.Cell>{user.IsAdmin?(<FaCheck className='text-green-500'/>):(<FaTimes className='text-red-500'/>)}</Table.Cell>

          <Table.Cell>
            <span  className='font-md text-red-500 hover:underline cursor-pointer'
            onClick={()=>{
              setShowModal(true);
              setUserIdToDelete(user._id);
            }}
            
            >Delete</span>
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
      ):(<p>There is no users yet</p>)
    
    
    
    }
    
 
    <Modal show={showModal}  onClose={()=>setShowModal(false)} popup size='md'>
     <Modal.Header/>

     <Modal.Body>
     <div className="text-center">
       <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
       <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
       
       <div className='flex justify-center gap-x-7'>
   <Button color='failure' onClick={handleDeleteUser}>Yes,I'm Sure</Button>
   <Button color='grey' onClick={()=>setShowModal(false)}>No</Button>



       </div>




     </div>





     </Modal.Body>




 



    </Modal>



    </div>
  )
}

export default DashUsers;
