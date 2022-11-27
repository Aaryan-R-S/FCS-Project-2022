import React, {useState} from 'react'
// import axios from "axios";


export default function PatientDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{

        const res=await fetch('http://localhost:3500/patient/patientDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: 'include',
        }).then((res) => res.json())
        //   console.log(res);
          setresponse(res)
    }



    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
                <button className="btn btn-primary" onClick={submit}>Show Details</button>

            </div>
            <div className="col">
            <div className="p-3 border bg-dark">Response</div>
            {JSON.stringify(response)}
            </div>
        </div>
        </div>
    </>
    );
}
