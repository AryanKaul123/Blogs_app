import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { app } from '../firebase';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage';
import { ref} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutSuccess } from '../redux/user/userSlice';
import { Modal } from 'flowbite-react';
 function DashProfile() {

  const dispatch=useDispatch();
  const {currentUser,error,loading}=useSelector((state)=>state.user); 
  const [showModal,setShowModal]=useState(null);
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [imageFileUploading,setImageFileUploading]=useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null)
  const [updateUserError,setUpdateUserError]=useState(null);
  const [formData,setFormData]=useState({});

  const filePickerRef=useRef();
  const handleImageChange=(e)=>{
     const file=e.target.files[0];
   if(file){
    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
   }
  }
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);

  const uploadImage=async()=>{
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName=new Date().getTime() +imageFile.name
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        setUpdateUserError("Cannot Update the User");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL});
          setImageFileUploading(false);
        });
      }
    );
  }
    
     

    
      
     const  handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value});
     }
     


     const handleSubmit=async(e)=>{
      e.preventDefault();
   
     setUpdateUserSuccess(null);
     setUpdateUserError(null);
     
      if(Object.keys(formData).length===0){
        setUpdateUserError('No changes Made');
        return;
      }
      if(imageFileUploading){
        setUpdateUserError("Please wait for image to upload")
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`http://localhost:4000/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      
        // Wait for the response body to be parsed as JSON
        const data = await res.json();
      
        console.log(data); // Log the parsed JSON data
      
        if (!res.ok) {
          dispatch(updateFailure(data.error));
          setUpdateUserError(data.message)
        } else {
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User profile updated succesfully");
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
      }
      
     }
     const handleDeleteUser=async()=>{
      setShowModal(false);

      try{
        dispatch(deleteUserStart());
        const res=await fetch(`http://localhost:4000/api/user/delete/${currentUser._id}`,{
          method:'DELETE',
          credentials:'include'
          
        });
     const data=res.json();
     if(!res.ok){
      dispatch(deleteUserFailure(error.message));

     }
     else{
      dispatch(deleteUserSuccess(data));
     }

      }
      catch(error){
        dispatch(deleteUserFailure(error.message));

      }



     }
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
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef}/>
        <div className=' relative w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full'>
        <img src={imageFileUrl||currentUser.profilePicture} alt='user' className='rounded-full w-full h-full border-8 object-cover border-[lighgray]'
       onClick={()=>filePickerRef.current.click()} 
       />
       {imageFileUploadProgress && (
        <CircularProgressbar value={imageFileUploadProgress||0}
        text={`${imageFileUploadProgress}%`}
        strokeWidth={5}
        styles={{
          root:{
            width:'100%',
            height:'100%',
            position:'absolute',
            top:0,
            left:0,

          },
          path:{
            stroke:`rgb(62,152,199,${imageFileUploadProgress/100})`,
          },
        }}
        />
       )}

        </div>
      {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' 
        defaultValue={currentUser.username} onChange={handleChange} />
         <TextInput type='email' id='email' placeholder='email' 
        defaultValue={currentUser.email} onChange={handleChange} />
         <TextInput type='password' id='password' placeholder='password' 
        defaultValue="***********" onChange={handleChange} />


        <Button type='submit' gradientDuoTone='purpleToBlue' outline 
        disabled={loading||imageFileUploading}
        >{loading?'Loading..':'Update'}
        
        </Button>
     {
      currentUser.IsAdmin && (
        <Link to={'/create-post'}>
        <Button
        type='button'
        gradientDuoTone='purpleToPink'
        className='w-full'
        
        
        >Create a Post</Button>
        
        
        </Link>
        
      )



     }  
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign out</span>
      </div>
      {
      updateUserSuccess && (
        <Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>
      )
      }
      {
        updateUserError &&(
          <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
        )
      }
      {
        error &&(
          <Alert color='failure' className='mt-5'>{error}</Alert>
        )
      }


    <Modal show={showModal}  onClose={()=>setShowModal(false)} popup size='md'>
     <Modal.Header/>

     <Modal.Body>
     <div className="text-center">
       <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
       <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your Account</h3>
       
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
 
export default DashProfile;