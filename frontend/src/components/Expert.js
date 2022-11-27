import React, {useState} from 'react'
import ExpertHome from './expert/ExpertHome'

export default function Expert() {

    const [Component, setcomponent] = useState(<ExpertHome/>)
    // const Component = <Login/>
    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addExpert= () =>{
        setcomponent(<ExpertHome/>)
    }
    const login= () =>{
        setcomponent(<ExpertHome/>)
    }
    const expertDetails= () =>{
        setcomponent(<ExpertHome/>)
    }
    const deleteExpert= () =>{
        setcomponent(<ExpertHome/>)
    }
    const logout= () =>{
        setcomponent(<ExpertHome/>)
    }
    const modifyDetails= () =>{
        setcomponent(<ExpertHome/>)
    }
    const verifyExpertAgain= () =>{
        setcomponent(<ExpertHome/>)
    }
    const releaseDoc= () =>{
        setcomponent(<ExpertHome/>)
    }
    const reportSusDoc= () =>{
        setcomponent(<ExpertHome/>)
    }
    const listSharedDoc= () =>{
        setcomponent(<ExpertHome/>)
    }
    const verifyDoc= () =>{
        setcomponent(<ExpertHome/>)
    }
    const signDoc= () =>{
        setcomponent(<ExpertHome/>)
    }
    const addMedicine= () =>{
        setcomponent(<ExpertHome/>)
    }
    const listRequestedOrders= () =>{
        setcomponent(<ExpertHome/>)
    }
    const cancelOrderRequest= () =>{
        setcomponent(<ExpertHome/>)
    }
    const billOrderRequest= () =>{
        setcomponent(<ExpertHome/>)
    }
    const listRequestedInsuranceApplication= () =>{
        setcomponent(<ExpertHome/>)
    }
    const approveInsuranceRequest= () =>{
        setcomponent(<ExpertHome/>)
    }
    const cancelInsuranceRequest= () =>{
        setcomponent(<ExpertHome/>)
    }
    const listInsuranceClaims= () =>{
        setcomponent(<ExpertHome/>)
    }
    const approveInsuranceClaim= () =>{
        setcomponent(<ExpertHome/>)
    }
    const rejectInsuranceClaim= () =>{
        setcomponent(<ExpertHome/>)
    }
    const sendOTPMail= () =>{
        setcomponent(<ExpertHome/>)
    }

    return (
    <>
        <div className="dropdown">
            <a className="btn btn-primary dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Options
            </a>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={addExpert}>Add Expert</button></li>
                <li><button className="dropdown-item" onClick={login}>Login</button></li>
                <li><button className="dropdown-item" onClick={expertDetails}>Expert Details</button></li>
                <li><button className="dropdown-item" onClick={modifyDetails}>Modify Details</button></li>
                <li><button className="dropdown-item" onClick={verifyExpertAgain}>Verify Expert</button></li>
                <li><button className="dropdown-item" onClick={releaseDoc}>Release Document</button></li>
                <li><button className="dropdown-item" onClick={reportSusDoc}>Report Sus Document</button></li>
                <li><button className="dropdown-item" onClick={listSharedDoc}>List Shared Documents</button></li>
                <li><button className="dropdown-item" onClick={verifyDoc}>Verify Document</button></li>
                <li><button className="dropdown-item" onClick={signDoc}>Sign Document</button></li>
                <li><button className="dropdown-item" onClick={addMedicine}>Add Medicine</button></li>
                <li><button className="dropdown-item" onClick={listRequestedOrders}>List Requested Orders</button></li>
                <li><button className="dropdown-item" onClick={cancelOrderRequest}>Cancel Order Request</button></li>
                <li><button className="dropdown-item" onClick={billOrderRequest}>Bill Order Request</button></li>
                <li><button className="dropdown-item" onClick={listRequestedInsuranceApplication}>List Insurance Request</button></li>
                <li><button className="dropdown-item" onClick={approveInsuranceRequest}>Approve Insurance Request</button></li>
                <li><button className="dropdown-item" onClick={cancelInsuranceRequest}>Cancel Insurance Request</button></li>
                <li><button className="dropdown-item" onClick={listInsuranceClaims}>List Insurance Claims</button></li>
                <li><button className="dropdown-item" onClick={approveInsuranceClaim}>Approve Insurance Claim</button></li>
                <li><button className="dropdown-item" onClick={rejectInsuranceClaim}>Reject Insurance Claim</button></li>
                <li><button className="dropdown-item" onClick={sendOTPMail}>Send OTP Mail</button></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                <li><button className="dropdown-item" onClick={deleteExpert}>Delete Expert</button></li>
                {/* <li><a className="dropdown-item disabled" href="/">Something else here</a></li> */}

            </ul>
        </div>
        {/* <ModifyDetails/>
        <Login/> */}
        {Component}
    </>
    );//className= my-2 gives margin of 2 to the element 
}
