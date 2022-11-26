//always write component name in capitals
import React from 'react'
// import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <>
    <nav className="navbar navbar-dark bg-light">
        <ul className="nav nav-pills">
        <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/patient">Patient</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/admin">Admin</a>
        </li>
        <li className="nav-item">
            <a className="nav-link disable" href="/expert">Expert</a>
        </li>
        </ul>
    </nav>
    </>
  )
}

//define the datatype of a prop so as to avoid bugs=> ckecks
// Navbar.propTypes={
//     title: PropTypes.string.isRequired,
//     aboutText: PropTypes.string.isRequired //this prop is needed either passed or dafault
// }

// //default values if the specific prop is not passes 
// Navbar.defaultProps={
//     title: 'set title'
// }