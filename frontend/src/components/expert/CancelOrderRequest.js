import React, {useState} from 'react'

import axios from "axios";

export default function CancelOrderRequest() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.orderid=document.getElementById("orderid").value

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/expert/cancelOrderRequest",
            data: JSON.stringify(dict),
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
        //   console.log(response);
          setresponse({messages: response.data.messages, orders: response.data.orders});
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
                    <label className="form-label">Order ID</label>
                    <input type="text" className="form-control" id="orderid"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Cancel</button>

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
