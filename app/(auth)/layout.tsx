import IconAuthImage from '@/components/assets/icons/authimage'
import { Card } from '@nextui-org/react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
    children: React.ReactNode
}

const Layout: NextPage<Props> = ({ children }) => {
    return (<div className='flex w-screen h-screen justify-center items-center overflow-hidden'>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-sm md:max-w-md xl:max-w-max xl:w-auto">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="py-17.5 px-26 text-center">
                        <Link className="mb-5.5 inline-block" href="/">
                            <p className='font-bold text-3xl text-black dark:text-white'>WhatsApp Api</p>
                        </Link>

                        <p className="2xl:px-20">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            suspendisse.
                        </p>

                        <span className="mt-15 inline-block">
                            <IconAuthImage />
                        </span>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 px-4 sm:px-8 xl:px-17.5 py-4 max-h-screen md:max-h-[80vh] overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
        {/* </Card> */}
    </div>)
}

export default Layout