import  { useState,useEffect } from 'react'
import { useAppStore } from '@/store'
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '@/lib/api-client';
import { PROFILE_SETUP } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [username, setUsername] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // Default to the first color index
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);

  const colors = [
    { color: "bg-[#8b5cf6]", id: 1 },
    { color: "bg-[#facc15]", id: 2 },
    { color: "bg-[#14b8a6]", id: 3 },
    { color: "bg-[#0ea5e9]", id: 4 }
  ];
  useEffect(() => {
    if(userInfo.profileSetUp){
      setUsername(userInfo.username);
      setSelectedColorIndex(userInfo.color);
      setImage(userInfo.avatar);
    }
  }, [userInfo])
  
  const handleColorSelect = (index) => {
    setSelectedColorIndex(index);
  };

  const validate = () => {
    if (!username) {
      toast.error("User Name Required !");
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (validate()) {
      try {
        const response = await apiClient.post(PROFILE_SETUP,
           { username, color: selectedColorIndex },
          { withCredentials: true });
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
          toast.success("Profile Updated Successfully!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTrashImage = () => {
    console.log('Trash image');
  };

  const handleFileUpload = () => {
    console.log("add image");
  };
  const handleBackButton = () => {
    if(userInfo.profileSetUp){
    navigate("/chat");
    }
    else{
      toast.error("Please setup profile");
    }
  }

  return (
    <div className='bg-[#111112] h-[100vh] flex justify-center items-center flex-col'>
      <div className='flex flex-col gap-10 w-[80vh] md:w-max'>
        <div onClick={handleBackButton}>
          <IoArrowBack className='text-2xl lg:text-4xl text-white/25 cursor-pointer' />
        </div>

        <div className='grid grid-cols-2 gap-5'>
          {/* Avatar Section */}
          <div className='rounded-full lg:w-36 lg:h-36 relative flex items-center justify-center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Avatar className={`cursor-pointer h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden ${colors[selectedColorIndex].color}`}>
              {image ? (
                <AvatarImage
                  src={image}
                  alt='profile'
                  className='cursor-pointer w-full h-full object-cover bg-black'
                />
              ) : (
                <AvatarFallback className='text-white size-5 uppercase h-full w-full flex items-center justify-center text-5xl'>
                  {username ? username[0].toUpperCase() : userInfo.email[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            {hovered && (<div className="cursor-pointer absolute inset-0 flex justify-center items-center bg-black/50 ring-fuchsia-50 rounded-full">
              {image ? <FaTrash size={25} onClick={handleTrashImage} /> : <FaPlus size={25} onClick={handleFileUpload} />}
            </div>)}
          </div>

          {/* Form Section */}
          <div className='flex flex-col gap-5 justify-center'>
            <input
              type="text"
              value={userInfo.email}
              readOnly
              className='bg-transparent text-white text-lg outline-none border-b border-white/50 placeholder:text-white/50'
            />
            <input
              type="text"
              placeholder='User Name'
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className='bg-transparent text-white text-lg outline-none border-b border-white/50 placeholder:text-white/50'
            />
          </div>
        </div>

        {/* Color Picker Section */}
        <div className='flex justify-center gap-4'>
          {colors.map(({ color, id }, index) => (
            <div
              key={id}
              onClick={() => handleColorSelect(index)}
              className={`${color} w-8 h-8 rounded-full cursor-pointer ${selectedColorIndex === index ? 'border-2 border-white' : ''}`}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className='flex justify-center'>
          <button
            onClick={handleSaveChanges}
            className='bg-[#a855f7] text-white text-lg px-8 py-3 rounded-lg'>
            Save Changes
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Profile;
