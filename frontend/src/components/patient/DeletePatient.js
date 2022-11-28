import React, {useState} from 'react'
import axios from "axios";

export default function DeletePatient() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)
        let a = axios.create({
            baseURL: url,
        });
        a.post(
            "/patient/deletePatient",
            JSON.stringify({}),
            {
                withCredentials: true,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
            }
            )
            .then(function (response) {
            //   console.log(response);
              setresponse(response.data.messages);
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
            
                <button className="btn btn-primary" onClick={submit}>Delete Account</button>

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
