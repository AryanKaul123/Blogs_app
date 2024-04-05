import { Alert, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import OAuth from '../components/OAuth';


const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
        return setErrorMessage("Please fill all the fields");
    }

    try {
        setLoading(true);
        setErrorMessage(null);

        // Create a clean version of formData without undefined values
        const cleanFormData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== undefined)
        );

        // Make the API request with cleanFormData
        const res = await fetch('http://localhost:4000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanFormData),
        });

        const data = await res.json();
        if (data.success === false) {
            return setErrorMessage(data.message);
        }

        setLoading(false);
        if (res.ok) {
            navigate("/signin");
        }
    } catch (error) {
        // Handle error, maybe display a message to the user
        setErrorMessage(error.message);
        setLoading(false);
    }
};





  return (
    <div className='min-h-screen mt-20'>
    <div className='flex p-3 max-w-3xl mx-auto  flex-col md:flex-row md:items-center gap-5'>
    {/* left side div */}
    <div className='flex-1'>
    <Link to="/" className=' text-4xl  font-bold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Kaul's</span>
        Blog
      </Link>
      <p className='text-sm mt-5 '>This is a demo project You can Signup with your email and password or With Google</p>
 

    </div>
    
    {/* right side div */}
         <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
             <div>
            <Label value='Your username'/>
         <TextInput
         type='text'
         placeholder='Username'
         id='username'
         onChange={handleInputChange}
         />

             </div>

             <div>
            <Label value='Your Email'/>
         <TextInput
         type='email'
         placeholder='Email'
         id='email'
         onChange={handleInputChange}
         />

             </div>

             <div>
            <Label value='Your password'/>
         <TextInput
         type='password'
         placeholder='Password'
         id='password'
         onChange={handleInputChange}
         />

             </div>
             <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
           {
            loading?(
            <>
            <Spinner size='sm'/>
            <span className='pl-3'>Loading...</span></>):'Sign up'
           }
             </Button>
             <OAuth/>
          </form>

          <div className='flex gap-2 text-sm mt-5 '>
            <span>Have an account?</span>
            <Link to='/signin'
            onChange={handleInputChange} className='text-blue-500'>Sign In</Link>

          </div>
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }






         </div>




    </div>
    </div>
  )
}
export default SignUp;
