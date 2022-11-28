import React, {useState} from 'react'
import Login from './patient/Login'
import ModifyDetails from './patient/ModifyDetails'
import AddPatient from './patient/AddPatient'
import PatientHome from './patient/PatientHome'
import DeletePatient from './patient/DeletePatient'
import Logout from './patient/Logout'
import PatientDetails from './patient/PatientDetails'
import VerifyPatientAgain from './patient/VerifyPatientAgain'
import FilterExpert from './patient/FilterExpert'
import ListDoc from './patient/ListDoc'
import DeleteDoc from './patient/DeleteDoc'
import UploadDoc from './patient/UploadDoc'
import ShareDoc from './patient/ShareDoc'
import ListMedicines from './patient/ListMedicines'
import RequestMedicine from './patient/RequestMedicine'
import ListBilledOrders from './patient/ListBilledOrders'
import PayBilledOrder from './patient/PayBilledOrder'
import RequestInsurance from './patient/RequestInsurance'
import ListInsurances from './patient/ListInsurances'
import MakeInsuranceClaim from './patient/MakeInsuranceClaim'
import SendOTPMail from './patient/SendOTPMail'

export default function Patient() {

    const [Component, setcomponent] = useState(<PatientHome/>)
    // const Component = <Login/>
    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addPatient= () =>{
        setcomponent(<AddPatient/>)
    }
    const login= () =>{
        setcomponent(<Login/>)
    }
    const patientDetails= () =>{
        setcomponent(<PatientDetails/>)
    }
    const deletePatient= () =>{
        setcomponent(<DeletePatient/>)
    }
    const logout= () =>{
        setcomponent(<Logout/>)
    }
    const modifyDetails= () =>{
        setcomponent(<ModifyDetails/>)
    }
    const verifyPatientAgain= () =>{
        setcomponent(<VerifyPatientAgain/>)
    }
    const filterExperts= () =>{
        setcomponent(<FilterExpert/>)
    }
    const listDocs= () =>{
        setcomponent(<ListDoc/>)
    }
    const deleteDoc= () =>{
        setcomponent(<DeleteDoc/>)
    }
    const uploadDoc= () =>{
        setcomponent(<UploadDoc/>)
    }
    const shareDoc= () =>{
        setcomponent(<ShareDoc/>)
    }
    const listMedicines= () =>{
        setcomponent(<ListMedicines/>)
    }
    const requestMedicine= () =>{
        setcomponent(<RequestMedicine/>)
    }
    const listBilledOrders= () =>{
        setcomponent(<ListBilledOrders/>)
    }
    const payBilledOrder= () =>{
        setcomponent(<PayBilledOrder/>)
    }
    const requestInsurance= () =>{
        setcomponent(<RequestInsurance/>)
    }
    const listInsurances= () =>{
        setcomponent(<ListInsurances/>)
    }
    const makeInsuranceClaim= () =>{
        setcomponent(<MakeInsuranceClaim/>)
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
                <li><button className="dropdown-item" onClick={login}>Log in</button></li>
                <li><button className="dropdown-item" onClick={addPatient}>Register</button></li>
                <li><button className="dropdown-item" onClick={patientDetails}>Show Details</button></li>
                <li><button className="dropdown-item" onClick={deletePatient}>Delete Account</button></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                <li><button className="dropdown-item" onClick={modifyDetails}>Modify Details</button></li>
                <li><button className="dropdown-item" onClick={verifyPatientAgain}>Verify Account Again</button></li>
                <li><button className="dropdown-item" onClick={filterExperts}>Filter Expert</button></li>
                <li><button className="dropdown-item" onClick={listDocs}>List Documents</button></li>
                <li><button className="dropdown-item" onClick={deleteDoc}>Delete Document</button></li>
                <li><button className="dropdown-item" onClick={uploadDoc}>Upload Document</button></li>
                <li><button className="dropdown-item" onClick={shareDoc}>Share Document</button></li>
                <li><button className="dropdown-item" onClick={listMedicines}>List Medicines</button></li>
                <li><button className="dropdown-item" onClick={requestMedicine}>Request Medicine</button></li>
                <li><button className="dropdown-item" onClick={listBilledOrders}>List Billed Orders</button></li>
                <li><button className="dropdown-item" onClick={payBilledOrder}>Pay Billed Orders</button></li>
                <li><button className="dropdown-item" onClick={requestInsurance}>Request Insurance</button></li>
                <li><button className="dropdown-item" onClick={listInsurances}>List Insurance</button></li>
                <li><button className="dropdown-item" onClick={makeInsuranceClaim}>Make Insurance Claim</button></li>
                <li><button className="dropdown-item" onClick={sendOTPMail}>Send OTP Mail</button></li>
                {/* <li><a className="dropdown-item disabled" href="/">Something else here</a></li> */}

            </ul>
        </div>
        {/* <ModifyDetails/>
        <Login/> */}
        {Component}
    </>
    );//className= my-2 gives margin of 2 to the element 
}
