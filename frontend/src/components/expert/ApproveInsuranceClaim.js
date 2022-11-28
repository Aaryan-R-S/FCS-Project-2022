import React, {useState} from 'react'
import axios from "axios";

export default function ApproveInsuranceClaim() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.claimid=document.getElementById("claimid").value
        dict.amount=document.getElementById("amount").value
        // console.log(dict)

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/expert/approveInsuranceClaim",
            data: JSON.stringify(dict),
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
        //   console.log(response);
          setresponse({messages: response.data.messages, insurances: response.data.insurances});
        })
        .catch(function (error) {
        //   console.log(error.response.data.messages);
          setresponse(error.response.data.messages);
        });
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
