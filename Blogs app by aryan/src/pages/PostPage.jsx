import React from 'react'
import {useParams} from 'react-router-dom';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner,Button } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

function PostPage() {
 const {postSlug}=useParams();
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(null);
 const [post,setPost]=useState(null);
 const [recentPosts,setRecentPosts]=useState(null);


 useEffect(()=>{
    const fetchPosts=async()=>{
        try{
            setLoading(true);
            const res=await fetch(`http://localhost:4000/api/post/getposts?slug=${postSlug}`,{
              credentials:'include',
            })
                  const data= await res.json();
                  if(!res.ok){
                    setError(true);
                    setLoading(false);
                    return;
                  }
                  if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                  }
        }
        catch(error){
           setError(true);
           setLoading(false);
        }
    }
    fetchPosts();
 },[postSlug]);

 useEffect(()=>{
try {
  const fetchRecentPosts=async()=>{
    const res=await fetch(`http://localhost:4000/api/post/getposts?limit=3`);
    const data= await res.json();
    
    if(res.ok){
      setRecentPosts(data.posts);
    }
  
  }
  fetchRecentPosts();
  
} catch (error) {
  
}

 },[])

 if(loading)
     return(
    <div className='flex justify-center items-center min-h-screen'>
<Spinner size='xl' />
    </div>
    );


 



  return (
    <main className='p-3 flex flex-col max-w-6xl min-h-screen '>
   <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title} </h1>
    

    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
    <Button color='gray' pill size='xs'>{post && post.category}</Button>
    
    </Link>

    <img src={post&&post.image} title={post&& post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
    
    <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction/>
      </div>
    
     <CommentSection postId={post._id}/>

     <div className='flex flex-col justify-center items-center'>
    <h1 className='text-xl mt-5'>Recent articles</h1>

    <div className='flex  flex-wrap'>
      {recentPosts &&
        
        recentPosts.map((post)=>(
          <PostCard key={post._id} post={post}/>
        ))

      
      
      }


    </div>

     </div>
     
    
    
    </main>
  )
}

export default PostPage
