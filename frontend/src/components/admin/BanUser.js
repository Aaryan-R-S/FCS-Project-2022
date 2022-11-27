import React, {useState} from 'react'
// import axios from "axios";

export default function BanUser() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.id=document.getElementById("id").value
        // console.log(dict)

        // Write API here (data required)
        let res

        res = res.data;
        // console.log(res)
        setresponse(res)
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
                <button className="btn btn-primary" onClick={submit}>Ban User</button>

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
