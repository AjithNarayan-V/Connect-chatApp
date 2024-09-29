// eslint-disable-next-line no-unused-vars
import Background from '@/assets/login2.png';
import Victory from '@/assets/victory.svg';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put(LOGIN_ROUTE, { email: loginEmail, password: loginPassword }, { withCredentials: true });

      if (response.data.users.id) {
        setUserInfo(response.data.users);
        if (response.data.users.profileSetUp)
          navigate("/chat");
        else
          navigate("/profile");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed. Please check your credentials.",{ autoClose: 3000,});
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(SIGNUP_ROUTE, {
        email: signupEmail,
        password: signupPassword,
      }, { withCredentials: true });
      if (response.status === 201) {
        setUserInfo(response.data.users);
        navigate("/profile");
      } 
    } catch (error) {
      if (error.response.status === 400) {
        // User already exists, redirect to login page
        toast.info("User already exists. Redirecting to login page.",{ autoClose: 3000,});
        window.location.href = '/auth';  // Redirect to login page
      } else {
        console.error("Error signing up:", error);
        toast.err("Sign-up failed. Please try again.",{ autoClose: 3000,});
      }
    }
  };

  return (
    <>
      <div className='h-screen w-screen flex items-center justify-center bg-gray-100'>
        <div className=' min-h-[90vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid lg:grid-cols-2'>
          <div className='flex flex-col gap-10 items-center justify-center p-6'>
            <div className='flex items-center justify-center flex-col mx-2'>
              <div className='flex  items-center justify-center'>
                <h1 className='text-4xl md:text-5xl  lg:text-[55px]  font-bold'>Welcome</h1>
                <img src={Victory} alt="victory emoji" className='h-16 md:h-20 lg:h-24 ml-4' />
              </div>
              <p className='font-medium text-center mt-4'>Fill in the details to get started with the best chat app!</p>
            </div>
            <div className='flex items-center justify-center w-full'>
              <Tabs className="w-3/4" defaultValue='login'>
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger value="login" className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[statw=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Login</TabsTrigger>
                  <TabsTrigger value="signin" className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[statw=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Signin</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className='flex flex-col gap-2'>
                  <form onSubmit={handleLoginSubmit} className='w-full'>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className='w-full p-3 border border-gray-300 rounded-md mb-2'
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className='w-full p-3 border border-gray-300 rounded-md mb-4'
                    />
                    <button type="submit" className='w-full rounded-md text-white bg-purple-500 hover:bg-purple-400 p-2 transition-all duration-300'>Login</button>
                  </form>
                </TabsContent>
                <TabsContent value="signin" className='flex flex-col gap-2'>
                  <form onSubmit={handleSignupSubmit} className='w-full'>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className='w-full p-3 border border-gray-300 rounded-md mb-2'
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className='w-full p-3 border border-gray-300 rounded-md mb-4'
                    />
                    <button type="submit" className='w-full rounded-md text-white bg-purple-500 hover:bg-purple-400 p-2 transition-all duration-300'>Sign in</button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className='hidden lg:flex items-center justify-center'>
            <img src={Background} alt="background" className='h-auto max-h-[380px] rounded-tr-3xl rounded-br-3xl' />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Auth;

