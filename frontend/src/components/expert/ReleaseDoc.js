import React, {useState} from 'react'

import axios from "axios";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function ReleaseDoc() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.healthid=document.getElementById("healthid").value
        dict.licenseno=document.getElementById("licenseno").value
        dict.file=document.getElementById("file").files[0].name
        dict.doctype=document.getElementById("doctype").value
        dict.otp=document.getElementById("otp").value

        const formData = new FormData();
        formData.append("healthid", dict.healthid);
        formData.append("licenseno", dict.licenseno);
        formData.append("file", document.getElementById("file").files[0])
        formData.append("doctype", dict.doctype);
        formData.append("otp", dict.otp);

        let url = (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/expert/releaseDoc",
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

    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" {...props}>
         Get it from 'Options' then 'Send OTP Mail'
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
                    <label className="form-label">License No</label>
                    <input type="number" className="form-control" id="licenseno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Attach Document</label>
                    <input type="file" className="form-control" id="file"/>
                </div>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                    <div className="mb-3">
                        <label className="form-label">Document Type</label>
                        <input type="text" className="form-control" id="doctype"/>
                    </div>
                </OverlayTrigger>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip1}>
                    <div className="mb-3">
                        <label className="form-label">OTP</label>
                        <input type="number" className="form-control" id="otp"/>
                    </div>
                </OverlayTrigger>
                <button className="btn btn-primary" onClick={submit}>Release</button>

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
