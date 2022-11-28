import React, {useState} from 'react'

import axios from "axios";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function FilterExpert() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.who=document.getElementById("who").value
        dict.name=document.getElementById("name").value
        dict.address=document.getElementById("address").value

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/patient/filterExperts",
            data: JSON.stringify(dict),
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
        //   console.log(response);
          setresponse({messages: response.data.messages, experts: response.data.experts});
        })
        .catch(function (error) {
        //   console.log(error.response.data.messages);
          setresponse(error.response.data.messages);
        });
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Must be a professional, hospital, pharmacy or insurancefirm
        </Tooltip>
    );
    

    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
        
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                    <div className="mb-3">
                    <label className="form-label">Type</label>
                    <input type="text" className="form-control" id="who"/>
                    </div>
                </OverlayTrigger>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" id="name"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" id="address"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Filter</button>

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
