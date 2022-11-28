import React, {useState} from 'react'
import axios from "axios";

export default function AdminDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.username = document.getElementById("username").value;
        // console.log(dict)
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)
        let a = axios.create({
            baseURL: url,
        });
        a.post(
            "/admin/adminDetails",
            JSON.stringify({ username:dict.username }),
            {
                withCredentials: true,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
            }
            )
            .then(function (response) {
            //   console.log(response);
              setresponse({messages: response.data.messages, data: response.data.data});
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
                    <label className="form-label">Username</label>
                    <input type="number" className="form-control" id="username"/>
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
