import React, {useState} from 'react'

import axios from "axios";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function PayBilledOrder() {

    const [response, setresponse] = useState();

    const submit = async () =>{
        var dict = {};
        dict.orderid=document.getElementById("orderid").value
        dict.otp=document.getElementById("otp").value
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/patient/payBilledOrder",
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

    const renderTooltip = (props) => (
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
                <label className="form-label">Order ID</label>
                <input type="text" className="form-control" id="orderid"/>
                </div>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                    <div className="mb-3">
                        <label className="form-label">OTP</label>
                        <input type="number" className="form-control" id="otp"/>
                    </div>
                </OverlayTrigger>
                <button className="btn btn-primary" onClick={submit}>Pay</button>

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
