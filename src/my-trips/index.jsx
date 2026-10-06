import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs  } from "firebase/firestore";
import {db} from '@/service/firebaseConfig'
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {

    const navigate=useNavigate();
    const[userTrips,setUserTrips] = useState([]);
    

  useEffect(()=>{
    GetUserTrips();
  },[])

    /**
     * Used to get All user trips
     * @returns 
     */


    const GetUserTrips=async()=>{
        const user=JSON.parse(localStorage.getItem('user'));
        
        if(!user){
            {
                navigate('/');
                return;
            }

        }
        
        const q=query(collection(db,'AITrips'), where('userEmail','==',user?.email))
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        querySnapshot.forEach((doc) => {
        
        console.log(doc.id, " => ", doc.data());
        setUserTrips(prevVal=>[...prevVal,doc.data()])
        });
    }
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
        <h2 className='font-bold text-3xl'>My Trips</h2>
        <div className=' mt-10 grid grid-cols-2 md:grid-cols-3 gap-5'>
            {userTrips?.length>0?userTrips.map((trip,index)=>(
                <UserTripCardItem trip={trip} key={index}/>
            ))
                :
                [1,2,3,4,5,6].map((item,index)=>(
                    <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>
                    
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default MyTrips