import route from '@/routes'
import { UserRegisterTypes } from '@/types'
import { Button, Input, Spinner } from '@nextui-org/react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    setStep: Dispatch<SetStateAction<string>>,
    userData?: UserRegisterTypes,
    setUserData: Dispatch<SetStateAction<UserRegisterTypes | undefined>>
}

const VerifyEmail: NextPage<Props> = ({ setStep, userData, setUserData }) => {
    const router = useRouter()
    const [otpInput, setOtpInput] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const submitOTP = async () => {
        setisLoading(true)
        try {
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/verify-email', {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + userData?.accessToken,
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    otpToken: otpInput
                })
            })
            if (result.ok) {
                toast.success('Verify success!')
                router.push(route('signin'))
            } else {
                console.log(await result.json())
                toast.error('Invalid OTP Token')
                setisLoading(false)
            }
        } catch (error) {
            toast.error('Server error...')
            console.log(error)
            setisLoading(false)
        }
    }
    const resendCode = async () => {
        setisLoading(true)
        try {
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/send-verification-email', {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + userData?.accessToken
                }
            })
            if (result.ok) {
                toast.success('OTP sent! Please check your email')
            } else {
                console.log(await result.json())
                toast.error('Error when sending otp')
            }
        } catch (error) {
            console.log(error)
            toast.error('Server error...')
        } finally {
            setisLoading(false)
        }
    }
    useEffect(() => {
        if (userData)
            resendCode()
    }, [userData])
    return (
        <div className='w-full'>
            <h2 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Verify your email
            </h2>
            <span className="mb-1.5 block font-medium text-center">Enter your OTP code below</span>
            {isLoading ? (<>
                <div className='flex justify-center'>
                    <Spinner />
                </div>
            </>) : (<>
                <Input
                    type="text"
                    variant='underlined'
                    size='lg'
                    placeholder='eg: 123456'
                    maxLength={6}
                    value={otpInput}
                    onChange={e => /^\d*$/.test(e.target.value) && setOtpInput(e.target.value)}
                />
                <p className='text-sm mt-2'>Didn't receive code? <span className='cursor-pointer text-primary' onClick={resendCode}>Resend Code</span></p>
                <div className='flex justify-between mt-4'>
                    <Button variant='light' radius='none' className='text-body/80' onClick={() => {
                        setStep('signup')
                    }}>Back</Button>
                    <Button
                        color={otpInput.length !== 6 ? 'default' : 'primary'}
                        radius='none'
                        disabled={otpInput.length !== 6}
                        onClick={submitOTP}>Submit</Button>
                </div>
            </>)}
        </div>
    )
}

export default VerifyEmail