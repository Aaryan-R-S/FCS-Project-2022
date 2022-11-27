import React, {useState} from 'react'
// import axios from "axios";

export default function AddAdmin() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.username=document.getElementById("username").value
        dict.password=document.getElementById("password").value
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
                    <input type="number" className="form-control" id="username"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="text" className="form-control" id="password"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Add Admin</button>

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
