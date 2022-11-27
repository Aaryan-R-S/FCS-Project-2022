import React, {useState} from 'react'
// import axios from "axios";

export default function CancelInsuranceRequest() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.insuranceid=document.getElementById("insuranceid").value
        // console.log(dict)

        // Write API here (data required)
        let res

        res = res.data;
        // console.log(res)
        setresponse(res)
    }

    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
            

                <div className="mb-3">
                    <label className="form-label">Insurance ID</label>
                    <input type="text" className="form-control" id="insuranceid"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Cancel</button>

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
