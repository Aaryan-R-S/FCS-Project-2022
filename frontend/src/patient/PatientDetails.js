import React, {useState} from 'react'


export default function PatientDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        // const res=await fetch('http://localhost:3500/patient/patientDetails', {
        //     method: 'POST'
        // }).then((res) => res.json())
        // // alert(JSON.stringify(`${res.message}, status: ${res.status}`));
        // console.log(res)

        const res=await fetch('http://localhost:3500/patient/patientDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            // body: JSON.stringify(dict)
        })
            .then((res) => res.json())
        console.log(res)
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
            <div className="p-3 border bg-light">Response</div>
            {JSON.stringify(response)}
            </div>
        </div>
        </div>
    </>
    );
}
