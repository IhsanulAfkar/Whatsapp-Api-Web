'use client'

import route from "@/routes";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function App() {
    const { data: session } = useSession()
    return (
        <Navbar position="sticky" className=" shadow-xl">
            <NavbarBrand>
                <p className="font-bold text-inherit">WhatsApp API</p>
            </NavbarBrand>
            {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent> */}
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    {!session?.user &&
                        <Link href={route('signin')}>Login</Link>
                    }
                </NavbarItem>
                <NavbarItem>
                    {session?.user ?
                        <Button as={Link} color="primary" href={route('dashboard')} variant="flat">
                            Dashboard
                        </Button> :
                        <Button as={Link} color="primary" href={route('signup')} variant="flat">
                            Sign Up
                        </Button>
                    }
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
