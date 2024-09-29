// eslint-disable-next-line no-unused-vars
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from "sonner";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetUp) {
      toast("please setup to continue.");
      alert("complete profile setup");
      navigate("/profile");
    }
  }, [userInfo, navigate])
  return (
    <div>chat</div>
  )
}

export default Chat;