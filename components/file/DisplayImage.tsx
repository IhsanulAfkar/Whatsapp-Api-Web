import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { useEffect, useState } from "react"

const DisplayImage = ({ imageUrl }: {
    imageUrl: string
}) => {
    const [fileName, setfileName] = useState('')
    const finalUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/' + imageUrl
    useEffect(() => {
        const parts = imageUrl.split('/')
        setfileName(parts[parts.length - 1])
    }, [])
    return (
        <>
            <Dropdown radius="none">
                <DropdownTrigger>
                    <Button className="" size="sm" fullWidth radius="none">

                        <div>view</div>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="DropdownImage">
                    <DropdownItem key="image" onClick={() => window.open(finalUrl, '_blank')}>
                        <img src={finalUrl} alt="" className="max-w-[200px]" />
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

export default DisplayImage