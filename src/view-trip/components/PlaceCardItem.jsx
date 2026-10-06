import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

function PlaceCardItem({place}) {

  const [PhotoUrl,setPhotoUrl]=useState();
  useEffect(() => {
      place&&GetPlacePhoto();
  }, [place])
  const GetPlacePhoto=async()=>{
      const data={
      
          textQuery:place.placeName
      }
  
      const result=await GetPlaceDetails(data).then(resp=>{
          console.log(resp.data.places[0].photos[4].name);
  
          const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[4].name);
          setPhotoUrl(PhotoUrl);
  })
  }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName} target='_blank'>
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img src={PhotoUrl?PhotoUrl:'/logo.png'}
        className='w-[130px] h-[130px] rounded-xl'
        />
        <div>
            <h2 className='font-bold text-lg'>{place.placeName}</h2>
            <p className='text-sm text-gray-400'>{place.placeDetails}</p>
            <h2 className='mt-2 text-md'>🕙{place.travelTimeFromHotel}</h2>
            {/* <Button size='sm'><FaMapLocationDot /></Button> */}
        </div>
    </div>
    </Link>
  )
}

export default PlaceCardItem