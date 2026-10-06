import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';




function Viewtrip() {
  const {tripId} = useParams();
  const [tripData, setTripData] = useState({});

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId])

  /**
   * Use this function to get trip data from firestore DB
   * 
   */
  const GetTripData=async()=>{
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTripData(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      toast('No trip found')
    } 
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/*Information Section*/}
      <InfoSection trip={tripData}/>

      {/* Recommend Hotels */}
      <Hotels trip={tripData}/>
      {/*Daily Plan*/}
      <PlacesToVisit trip={tripData}/>
      {/*footer*/}
      <Footer trip={tripData}/>

    </div>
  )
}

export default Viewtrip