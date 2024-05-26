'use client'
import { NextPage } from 'next'
import { useState } from 'react'
import SignUp from './SignUp'
import VerifyEmail from './VerifyEmail'
import { UserRegisterTypes } from '@/types'
import SuccessRegister from './SuccessRegister'

interface Props { }

const Steps: NextPage<Props> = ({ }) => {
    const [step, setstep] = useState('signup')
    const [userData, setUserData] = useState<UserRegisterTypes>()
    return (<>
        {step === 'signup' && <SignUp setStep={setstep}
            userData={userData}
            setUserData={setUserData} />}

        {step === 'verify' && <VerifyEmail setStep={setstep}
            userData={userData}
            setUserData={setUserData} />}
    </>)
}
export default Steps