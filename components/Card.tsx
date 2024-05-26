import React from 'react'

const Card = ({ children, className = '' }: {
    children: React.ReactNode,
    className?: HTMLDivElement["className"]
}) => {
    return (
        <div className={'rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-3 px-7.5 ' + className}>
            {children}
        </div>
    )
}

export default Card