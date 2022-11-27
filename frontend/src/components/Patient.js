import React from 'react'
import '../App.css'
import PatientDetails from './patient/PatientDetails'
import Login from './patient/Login'
import ModifyDetails from './patient/ModifyDetails'

export default function Patient() {
    
    // const handleUpClick=()=>{
    //     let newText=text.toUpperCase();
    //     setText(newText);
    //     props.showAlert("Converted to Uppercase","success");
    // }
    // const handleLowClick=()=>{
    //     let newText=text.toLowerCase();
    //     setText(newText);
    //     props.showAlert("Converted to Lowercase","success");

    // }

    let fun=""

    const log=()=>{
        console.log(fun)
    }

    // const getLength = (word)=>{
    //     const arr= word.split(" ");
    //     const new_arr=arr.filter((value, index, arr)=>{
    //         return value!=="";
    //     });
    //     return new_arr.length;
    // }

    // const handleOnChange=(event)=>{
    //     setText(event.target.value);
    // }

    //useState =>text is a variable which have a value within useState and when the text is updated via setText function

    const addPatient= () =>{
        fun="addPatient"
        log()
    }
    const login= () =>{
        fun="plant"
        log()
    }
    const patientDetails= () =>{
        fun="plant"
        log()
    }
    const deletePatient= () =>{
        fun="plant"
        log()
    }
    const logout= () =>{
        fun="plant"
        log()
    }
    const modifyDetails= () =>{
        fun="plant"
        log()
    }
    const verifyPatientAgain= () =>{
        fun="plant"
        log()
    }
    const filterExperts= () =>{
        fun="plant"
        log()
    }
    const listDocs= () =>{
        fun="plant"
        log()
    }
    const deleteDoc= () =>{
        fun="plant"
        log()
    }
    const uploadDoc= () =>{
        fun="plant"
        log()
    }
    const shareDoc= () =>{
        fun="plant"
        log()
    }


    return (
    <>
        <div className="dropdown">
            <a className="btn btn-primary dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Options
            </a>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={addPatient}>Register</button></li>
                <li><button className="dropdown-item" onClick={login}>Log in</button></li>
                <li><button className="dropdown-item" onClick={patientDetails}>Show Details</button></li>
                <li><button className="dropdown-item" onClick={modifyDetails}>Modify Details</button></li>
                <li><button className="dropdown-item" onClick={verifyPatientAgain}>Verify Account</button></li>
                <li><button className="dropdown-item" onClick={filterExperts}>Filter Expert</button></li>
                <li><button className="dropdown-item" onClick={uploadDoc}>Upload Document</button></li>
                <li><button className="dropdown-item" onClick={shareDoc}>Share Document</button></li>
                <li><button className="dropdown-item" onClick={listDocs}>List Documents</button></li>
                <li><button className="dropdown-item" onClick={deleteDoc}>Delete Document</button></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                <li><button className="dropdown-item" onClick={deletePatient}>Delete Account</button></li>
                {/* <li><a className="dropdown-item disabled" href="/">Something else here</a></li> */}
            </ul>
        </div>
        <ModifyDetails/>
        <PatientDetails/>
        <Login/>
    </>
    );//className= my-2 gives margin of 2 to the element 
}
