import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import React, { useState, useEffect } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton, { googleClientId } from '../components/custom/GoogleSignInButton';

const googlePlacesApiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY


function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleInputChange = (name, value) => {

        setFormData({
            ...formData,
            [name]: value
        })

    }
    useEffect(() => {
        console.log(formData)
    }, [formData])

    const OnGenerateTrip = async () => {

        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true)
            return;
        }

        if (!formData?.noOfDays || formData.noOfDays <= 0) {
        toast("Please enter a valid number of days (greater than 0)");
        return;
    }

        if (!formData?.location || !formData?.budget || !formData?.travelers) {
            toast("please fill all details");
            return;
        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{traveler}', formData?.travelers)
            .replace('{budget}', formData?.budget)
            .replace('{totalDays}', formData?.noOfDays)
        /*console.log(FINAL_PROMPT)*/

        const result = await chatSession.sendMessage(FINAL_PROMPT);

        console.log('--', result?.response?.text());
        setLoading(false);
        SaveAITrip(result?.response?.text());
    }

    const SaveAITrip = async (TripData) => {

        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString()
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId
        });
        setLoading(false);
        navigate('/view-trip/'+docId)


    }

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
            OnGenerateTrip();
        })
    }
    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
            <p className='mt-3 text-gray-500 tex-xl' >
                Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
            </p>
            <div className='mt-8 flex flex-col gap-6'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
                    {googlePlacesApiKey ? (
                        <GooglePlacesAutocomplete
                            apiKey={googlePlacesApiKey}
                            selectProps={{
                                place,
                                onChange: (v) => { setPlace(v); handleInputChange('location', v) },
                                placeholder: 'Enter a location',
                            }}
                        />
                    ) : (
                        <Input
                            placeholder='Enter a location'
                            onChange={(e) => handleInputChange('location', { label: e.target.value })}
                        />
                    )}
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip for?</h2>
                    <Input type='number' placeholder='Enter number of days'
                        onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <h2 className='text-xl my-3 font-medium'>What is your budget for the trip?</h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectBudgetOptions.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                            ${formData.budget === item.title ? 'shadow-lg border-black' : ''}
                        `}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>
                    ))}
                </div>

            </div>
            <div>
                <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectTravelsList.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('travelers', item.people)}
                            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                            ${formData.travelers === item.people ? 'shadow-lg border-black' : ''}
                        `}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>
                    ))}
                </div>

            </div>
            <div className='my-10 justify-end flex'>
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip}>
                    {loading ?
                        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
                        :
                        'Generate Trip'
                    }
                </Button>

            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogClose asChild={Button} className='absolute top-2 right-2'></DialogClose>
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

    )
}

export default CreateTrip