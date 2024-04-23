import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import FooterComponent from "./components/FooterComponent"
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import OnlyAdminPrivateRoute  from './components/OnlyAdminPrivateRoute'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header/>
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route path='/signin' element={<SignIn/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    <Route path='/projects' element={<Projects/>}/>
    
    <Route element={<PrivateRoute/>}>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Route>

    <Route element={<OnlyAdminPrivateRoute/>}>
    <Route path='/create-post' element={<CreatePost/>}/>
    <Route path='/update-post/:postId' element={<UpdatePost/>}/>
  
  
    </Route>

    <Route path='/post/:postSlug' element={<PostPage/>}/>


  


    </Routes>
    <FooterComponent/>
    
    
    
    </BrowserRouter>
  )
}
