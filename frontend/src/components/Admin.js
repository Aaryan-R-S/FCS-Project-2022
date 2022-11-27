import React, {useState} from 'react'
import '../App.css'
import AdminHome from './admin/AdminHome'

export default function Patient() {

    const [Component, setcomponent] = useState(<AdminHome/>)
    // const Component = <Login/>
    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addPatient= () =>{
        setcomponent(<AdminHome/>)
    }

    
    


    return (
    <>
        <div className="dropdown">
            <a className="btn btn-primary dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Options
            </a>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={addPatient}>Register</button></li>
                {/* <li><a className="dropdown-item disabled" href="/">Something else here</a></li> */}

            </ul>
        </div>
        {/* <ModifyDetails/>
        <Login/> */}
        {Component}
    </>
    );//className= my-2 gives margin of 2 to the element 
}
