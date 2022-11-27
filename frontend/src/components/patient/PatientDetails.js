import React, {useState} from 'react';

export default function PatientDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)

        const res=await fetch(`${url}/patient/patientDetails`, {
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
