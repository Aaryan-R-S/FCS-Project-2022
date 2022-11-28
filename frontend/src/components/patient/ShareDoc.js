import React, {useState} from 'react'

import axios from "axios";

export default function ShareDoc() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value
        dict.documentid=document.getElementById("documentid").value
        
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/patient/shareDoc",
            data: JSON.stringify(dict),
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
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
            

                <div className="mb-3">
                <label className="form-label">License No</label>
                <input type="number" className="form-control" id="licenseno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document ID</label>
                    <input type="text" className="form-control" id="documentid"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Share</button>

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
