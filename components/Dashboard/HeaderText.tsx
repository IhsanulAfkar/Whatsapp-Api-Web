import { NextPage } from 'next'

interface Props {
    children: string
}

const HeaderText: NextPage<Props> = ({ children }) => {
    return <p className='text-black dark:text-white text-2xl font-bold mb-4 xl:mb-6'>{children}</p>
}

export default HeaderText