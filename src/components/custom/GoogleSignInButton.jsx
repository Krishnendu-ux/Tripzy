import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'

const googleClientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID

function GoogleSignInButton({ onSuccess }) {
  const login = useGoogleLogin({
    onSuccess,
    onError: (error) => console.log(error),
  })

  return (
    <Button
      onClick={login}
      className='w-full mt-5 flex gap-4 items-center'>
      <FcGoogle className='h-7 w-7' />
      Sign in With Google
    </Button>
  )
}

export { googleClientId }
export default GoogleSignInButton
