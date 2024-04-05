import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { app } from '../firebase';
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage';
import { ref} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';

 function DashProfile() {
  const dispatch=useDispatch();
  const {currentUser}=useSelector((state)=>state.user);
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL});
        });
      }
    );
  }
    
     

    
      
     const  handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value});
     }
     console.log(formData);


     const handleSubmit=async(e)=>{
      e.preventDefault();
      if(Object.keys(formData).length===0){
        return;
      }
      try{
        dispatch(updateStart());
        const res=await fetch(`http://localhost:4000/api/user/update/${currentUser._id}`,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${'Aryankaul'}`
          },
          body:JSON.stringify(formData),
        }
        );
       console.log(res.json());
        const data= await res.json();
       
        console.log(data);
        if(!res.ok){
          dispatch(updateFailure(data.error));
        }
        else{
          dispatch(updateSuccess(data));
        }



      }
      catch(error){
        dispatch(updateFailure(error.message));

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


        <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
       
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
      
    </div>
  )
}
 
export default DashProfile;