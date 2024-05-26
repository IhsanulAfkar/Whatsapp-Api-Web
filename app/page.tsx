'use client'
import Navbar from '@/components/Landing/Navbar'
import { NextPage } from 'next'
import { Animator, batch, Fade, Move, ScrollContainer, ScrollPage } from 'react-scroll-motion'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    const FadeUp = batch(Move(), Fade())
    return (<>
        <Navbar />
        <ScrollContainer>
            <ScrollPage className='bg-no-repeat bg-cover' style={{
                backgroundImage: 'url(/images/bg1.png)',
            }}>
                <Animator animation={FadeUp} className='flex flex-col h-full w-full  items-center justify-center' >
                    <div className=''>

                        <p className=''>lorem</p>
                    </div>
                </Animator>
            </ScrollPage>
        </ScrollContainer>
    </>)
}

export default Page