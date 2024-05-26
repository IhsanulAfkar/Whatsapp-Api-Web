import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DisplayFile = ({ fileUrl }: { fileUrl: string }) => {
    const router = useRouter()
    const [fileName, setfileName] = useState('')
    const finalUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/' + fileUrl
    useEffect(() => {
        const parts = fileUrl.split('/')
        setfileName(parts[parts.length - 1])
    }, [])
    return (
        <Button size='sm' as={Link} target='_blank' href={finalUrl} className="flex justify-between text-[#777C88] bg-neutral-75 rounded-md" fullWidth>
            <div className='flex items-center gap-2'>
                <div className='flex-none'>
                    <img className='invert-[1] grayscale-0' src="/assets/icons/attach_file.svg" alt="" />
                </div>
                <div>
                    {fileName}
                </div>
            </div>
            <div>view</div>
        </Button>
    )
}

export default DisplayFile