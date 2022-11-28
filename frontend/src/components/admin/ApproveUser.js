import React, {useState} from 'react'
import axios from "axios";

export default function ApproveUser() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.id = document.getElementById("id").value;
        // console.log(dict)
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)
        let a = axios.create({
            baseURL: url,
        });
        a.post(
            "/admin/approveUser",
            JSON.stringify({ id:dict.id }),
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
        
                <div className="mb-3">
                    <label className="form-label">ID</label>
                    <input type="number" className="form-control" id="id"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Approve User</button>

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
