
import { getInitials } from '@/helper/utils'
import React from 'react'
interface ProfileAvatarProps {
    profile?: {
        colorCode: string,
        firstName: string,
        lastName: string
    }
}
const ProfileAvatar = ({ profile }: ProfileAvatarProps) => {
    if (profile)
        return (
            <div style={{
                backgroundColor: '#' + profile.colorCode
            }} className={`flex-none rounded-full text-white w-8 h-8 flex items-center justify-center`}>{getInitials(profile.firstName + ' ' + (profile.lastName || ''))}</div>
        )
    return (
        <div className={`flex-none rounded-full text-white w-8 h-8 flex items-center justify-center bg-primary`}></div>
    )
}

export default ProfileAvatar