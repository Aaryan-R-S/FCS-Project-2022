import React, {useState} from 'react'
// import axios from "axios";

export default function ApproveInsuranceClaim() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.claimid=document.getElementById("claimid").value
        dict.amount=document.getElementById("amount").value
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
                    <label className="form-label">Claim ID</label>
                    <input type="text" className="form-control" id="claimid"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" id="amount"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Approve Claim</button>

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
