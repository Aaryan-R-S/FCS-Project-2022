import React, {useState} from 'react'

import axios from "axios";

export default function ReleaseDoc() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value
        dict.file=document.getElementById("file").files[0].name

        const formData = new FormData();
        formData.append("licenseno", dict.licenseno);
        formData.append("file", document.getElementById("file").files[0])

        let url = (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/expert/uploadImage",
            data: formData,
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "multipart/form-data" },
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
                    <label className="form-label">Attach Image</label>
                    <input type="file" className="form-control" id="file"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Upload Image</button>

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
