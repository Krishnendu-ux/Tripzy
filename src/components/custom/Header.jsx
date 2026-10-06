import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import axios from 'axios'
import GoogleSignInButton, { googleClientId } from './GoogleSignInButton'



function Header() {

  const user=JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  


  useEffect(() => {
    console.log(user);
  }, [])

const GetUserProfile = (tokenInfo) => {
  axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`, {


      headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
      }
  }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data))
      setOpenDialog(false);
      window.location.reload()
  })
}

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <a href='/'>
      <img className="h-7"
        src="/logo.svg"  
      />
      </a>
      <div>
       {user?
       <div className="flex items-center gap-5">
        <a href='/create-trip'>
        <Button variant='outline' className='rounded-full'>+ Create Trip</Button>
        </a>
        <a href='/my-trips'>
        <Button variant='outline' className='rounded-full'>My trips</Button>
        </a>
        <Popover>
        <PopoverTrigger>
        <img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/>
        </PopoverTrigger>
        <PopoverContent>
          <h2 className="cursor-pointer" onClick={()=>{
            googleLogout();
            localStorage.clear();
            window.location.reload();
            
          }}>Logout</h2>
        </PopoverContent>
      </Popover>

       </div>
       :
       
       <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
       } 
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent>
                          <DialogClose asChild={Button} className='absolute top-2 right-2'>
                          
                          </DialogClose>
                          <DialogHeader>
                              <DialogDescription>
                                  <img src="/logo.svg" />
                                  <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
                                  <p>Sign in to the App with Google authentication securely</p>
                                  {googleClientId ? (
                                    <GoogleSignInButton onSuccess={GetUserProfile} />
                                  ) : (
                                    <p className='mt-5 text-sm text-red-500'>Google sign-in is not configured.</p>
                                  )}
                              </DialogDescription>
                          </DialogHeader>
                          
                      </DialogContent>
                  </Dialog>
    </div>
  );
}

export default Header;
