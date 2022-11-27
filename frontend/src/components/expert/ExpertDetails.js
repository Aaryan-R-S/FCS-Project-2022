import React, {useState} from 'react'
// import axios from "axios";

export default function ExpertDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.username=document.getElementById("username").value
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
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" id="username"/>
                </div>
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
