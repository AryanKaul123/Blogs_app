import { Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'
const SignIn = () => {
  return (
    <div className='min-h-screen mt-20'>
    <div className='flex p-3 max-w-3xl mx-auto  flex-col md:flex-row md:items-center gap-5'>
    {/* left side div */}
    <div className='flex-1'>
    <Link to="/" className=' text-4xl  font-bold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Aryan's</span>
        Blog
      </Link>
      <p className='text-sm mt-5 '>This is a demo project You can Signup with your email and password or With Google</p>
 

    </div>
    
    {/* right side div */}
         <div className='flex-1'>
          <form className='flex flex-col gap-4 '>
             <div>
            <Label value='Your username'/>
         <TextInput
         type='text'
         placeholder='Username'
         id='username'
         />

             </div>

             <div>
            <Label value='Your Email'/>
         <TextInput
         type='text'
         placeholder='Email'
         id='email'
         />

             </div>

             <div>
            <Label value='Your password'/>
         <TextInput
         type='text'
         placeholder='Password'
         id='password'
         />

             </div>
             <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
             </Button>

          </form>






         </div>




    </div>
    </div>
  )
}

export default SignIn
