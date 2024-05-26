import HeaderText from '@/components/Dashboard/HeaderText'
import { Metadata, NextPage } from 'next'
import Contact from './Contact'

interface Props { }
export const metadata: Metadata = {
    title: 'Contact'

}
const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Contact</HeaderText>
        <Contact />
    </>)
}

export default Page