import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-lg'>Places to Visit</h2>
            <div>
                {/* Get and sort day keys before mapping */}
                {Object.keys(trip?.tripData?.itinerary || {})
                    .sort((a, b) => {
                        // Extract the number from "day1", "day2", etc.
                        const numA = parseInt(a.replace("day", ""), 10);
                        const numB = parseInt(b.replace("day", ""), 10);
                        return numA - numB; // Sort numerically
                    })
                    .map((dayKey, index) => (
                        <div key={index} className='mt-5'>
                            <h2 className="font-bold text-lg">
                                {dayKey.toUpperCase()} {/* Displays: DAY1, DAY2, etc. */}
                            </h2>
                            <p className="text-gray-600">
                                Best Times to Visit: {trip?.tripData?.itinerary[dayKey]?.bestTimeToVisit}
                            </p>
                            <div className='grid md:grid-cols-2 gap-5'>
                            {trip?.tripData?.itinerary[dayKey]?.schedule?.map((place, index) => (
                                <div className=''>
                                    {/* <h2 className='font-medium text-sm text-orange-600'>{place.rating}</h2> */}
                                    <PlaceCardItem place={place} />
                                    
                                </div>
                                ))}
                            </div>
                        </div>
                    ))}

            </div>

        </div>
    )
}

export default PlacesToVisit