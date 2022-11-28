import React, {useState} from 'react'

import axios from "axios";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function UploadDoc() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.healthid=document.getElementById("healthid").value
        dict.file=document.getElementById("file").files[0].name
        dict.doctype=document.getElementById("doctype").value

        const formData = new FormData();
        formData.append("healthid", dict.healthid);
        // console.log(document.getElementById("file").files[0])
        formData.append("file", document.getElementById("file").files[0])
        formData.append("doctype", dict.doctype);


        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/patient/uploadDoc",
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

    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Must be a prescription, dischargesummaries, testresults or bill
        </Tooltip>
    );


    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
            

                <div className="mb-3">
                <label className="form-label">Health id</label>
                <input type="number" className="form-control" id="healthid"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document</label>
                    <input type="file" className="form-control" id="file"/>
                </div>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                    <div className="mb-3">
                        <label className="form-label">Document Type</label>
                        <input type="text" className="form-control" id="doctype"/>
                    </div>
                </OverlayTrigger>
                <button className="btn btn-primary" onClick={submit}>Upload</button>

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
