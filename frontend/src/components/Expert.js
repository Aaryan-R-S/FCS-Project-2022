import React, {useState} from 'react'
import AddExpert from './expert/AddExpert'
import AddMedicine from './expert/AddMedicine'
import ApproveInsuranceClaim from './expert/ApproveInsuranceClaim'
import ApproveInsuranceRequest from './expert/ApproveInsuranceRequest'
import BillOrderRequest from './expert/BillOrderRequest'
import CancelInsuranceRequest from './expert/CancelInsuranceRequest'
import CancelOrderRequest from './expert/CancelOrderRequest'
import DeleteExpert from './expert/DeleteExpert'
import ExpertDetails from './expert/ExpertDetails'
import ExpertHome from './expert/ExpertHome'
import ListInsuranceClaims from './expert/ListInsuranceClaims'
import ListRequestedInsuranceApplication from './expert/ListRequestedInsuranceApplication'
import ListRequestedOrders from './expert/ListRequestedOrders'
import ListSharedDoc from './expert/ListSharedDoc'
import Login from './expert/Login'
import Logout from './expert/Logout'
import ModifyDetails from './expert/ModifyDetails'
import RejectInsuranceClaim from './expert/RejectInsuranceClaim'
import ReleaseDoc from './expert/ReleaseDoc'
import ReportSusDoc from './expert/ReportSusDoc'
import SendOTPMail from './expert/SendOTPMail'
import SignDoc from './expert/SignDoc'
import VerifyDoc from './expert/VerifyDoc'
import VerifyExpertAgain from './expert/VerifyExpertAgain'

export default function Expert() {

    const [Component, setcomponent] = useState(<ExpertHome/>)
    // const Component = <Login/>
    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addExpert= () =>{
        setcomponent(<AddExpert/>)
    }
    const login= () =>{
        setcomponent(<Login/>)
    }
    const expertDetails= () =>{
        setcomponent(<ExpertDetails/>)
    }
    const deleteExpert= () =>{
        setcomponent(<DeleteExpert/>)
    }
    const logout= () =>{
        setcomponent(<Logout/>)
    }
    const modifyDetails= () =>{
        setcomponent(<ModifyDetails/>)
    }
    const verifyExpertAgain= () =>{
        setcomponent(<VerifyExpertAgain/>)
    }
    const releaseDoc= () =>{
        setcomponent(<ReleaseDoc/>)
    }
    const reportSusDoc= () =>{
        setcomponent(<ReportSusDoc/>)
    }
    const listSharedDoc= () =>{
        setcomponent(<ListSharedDoc/>)
    }
    const verifyDoc= () =>{
        setcomponent(<VerifyDoc/>)
    }
    const signDoc= () =>{
        setcomponent(<SignDoc/>)
    }
    const addMedicine= () =>{
        setcomponent(<AddMedicine/>)
    }
    const listRequestedOrders= () =>{
        setcomponent(<ListRequestedOrders/>)
    }
    const cancelOrderRequest= () =>{
        setcomponent(<CancelOrderRequest/>)
    }
    const billOrderRequest= () =>{
        setcomponent(<BillOrderRequest/>)
    }
    const listRequestedInsuranceApplication= () =>{
        setcomponent(<ListRequestedInsuranceApplication/>)
    }
    const approveInsuranceRequest= () =>{
        setcomponent(<ApproveInsuranceRequest/>)
    }
    const cancelInsuranceRequest= () =>{
        setcomponent(<CancelInsuranceRequest/>)
    }
    const listInsuranceClaims= () =>{
        setcomponent(<ListInsuranceClaims/>)
    }
    const approveInsuranceClaim= () =>{
        setcomponent(<ApproveInsuranceClaim/>)
    }
    const rejectInsuranceClaim= () =>{
        setcomponent(<RejectInsuranceClaim/>)
    }
    const sendOTPMail= () =>{
        setcomponent(<SendOTPMail/>)
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
