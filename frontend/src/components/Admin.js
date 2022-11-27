import React, {useState} from 'react'
import AddAdmin from './admin/AddAdmin'
import AdminDetails from './admin/AdminDetails'
import AdminHome from './admin/AdminHome'
import ApproveUser from './admin/ApproveUser'
import BanUser from './admin/BanUser'
import DeleteAdmin from './admin/DeleteAdmin'
import ListPendingUsers from './admin/ListPendingUsers'
import ListSusDocs from './admin/ListSusDocs'
import Login from './admin/Login'
import Logout from './admin/Logout'
import RemoveUser from './admin/RemoveUser'
import VerifyUserAgain from './admin/VerifyUserAgain'

export default function Patient() {

    const [Component, setcomponent] = useState(<AdminHome/>)
    // const Component = <Login/>
    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addAdmin= () =>{
        setcomponent(<AddAdmin/>)
    }
    const login= () =>{
        setcomponent(<Login/>)
    }
    const adminDetails= () =>{
        setcomponent(<AdminDetails/>)
    }
    const listPendingUsers= () =>{
        setcomponent(<ListPendingUsers/>)
    }
    const approveUser= () =>{
        setcomponent(<ApproveUser/>)
    }
    const banUser= () =>{
        setcomponent(<BanUser/>)
    }
    const verifyUserAgain= () =>{
        setcomponent(<VerifyUserAgain/>)
    }
    const listSusDocs= () =>{
        setcomponent(<ListSusDocs/>)
    }
    const removeUser= () =>{
        setcomponent(<RemoveUser/>)
    }
    const logout= () =>{
        setcomponent(<Logout/>)
    }
    const deleteAdmin= () =>{
        setcomponent(<DeleteAdmin/>)
    }

    return (
    <>
        <div className="dropdown">
            <a className="btn btn-primary dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Options
            </a>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={addAdmin}>Add Admin</button></li>
                <li><button className="dropdown-item" onClick={login}>Login</button></li>
                <li><button className="dropdown-item" onClick={adminDetails}>Admin Details</button></li>
                <li><button className="dropdown-item" onClick={listPendingUsers}>List Pending Users</button></li>
                <li><button className="dropdown-item" onClick={approveUser}>Approve User</button></li>
                <li><button className="dropdown-item" onClick={banUser}>Ban User</button></li>
                <li><button className="dropdown-item" onClick={verifyUserAgain}>Verify User Again</button></li>
                <li><button className="dropdown-item" onClick={listSusDocs}>List Documents</button></li>
                <li><button className="dropdown-item" onClick={removeUser}>Remove User</button></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                <li><button className="dropdown-item" onClick={deleteAdmin}>Delete Admin</button></li>
                {/* <li><a className="dropdown-item disabled" href="/">Something else here</a></li> */}

            </ul>
        </div>
        {/* <ModifyDetails/>
        <Login/> */}
        {Component}
    </>
    );//className= my-2 gives margin of 2 to the element 
}
