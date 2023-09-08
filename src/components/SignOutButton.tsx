'use client'

import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

const SignOutButton: FC<SignOutButtonProps> = ({ ...Props }) => {
   const [isSigningOut, setisSigningOut] = useState<boolean>(false)
   return <Button {...Props} variant='ghost' onClick={async () => {
      setisSigningOut(true)
      try {
         await signOut()
      } catch (error) {
         toast.error('there was a problem signin out')
      }
      finally {
         setisSigningOut(false)
      }
   }}>
      {isSigningOut ? (<Loader2 className='animate-spin h-4 w-4' />) : (<LogOut className='w-4 h-4' />)}
   </Button>
}

export default SignOutButton