import React from 'react'
import Link from 'next/link'

const Header = ({ currentUser }) => {

    const links = [
        !currentUser && {label:'Sign Up',href:'/auth/signup'},
        !currentUser && {label:'Sign In',href:'/auth/signin'},
        currentUser && {label:'Sign Out',href:'/auth/signout'}
    ].filter(linkConfig => linkConfig) // Filter out falsy values

    const renderedLinks = links.map(({label,href})=>(
        <li className='nav-item' key={href}>
            <Link href={href} className='nav-link'>
                {label}
            </Link>
        </li>
    ));

    console.log(links);
    return (
        <nav className='navbar navbar-dark bg-dark'>
            <Link className="navbar-brand" href="/">
                TicketAll
            </Link> 

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {renderedLinks}
                </ul>
            </div>
        </nav>
    )
}

export default Header
