import React from 'react'

export default function View() {

    const submit = async () =>{
        var dict = {};
        dict.id = document.getElementById("id").value;
        dict.id = dict.id.replace("public","")
        // console.log(dict)
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)
        window.open(url+"/document/"+dict.id);
    }

    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
            
                <div className="mb-3">
                    <label className="form-label">Enter Document ID</label>
                    <input type="text" className="form-control" id="id"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>View Document</button>
            </div>

        </div>
        </div>
    </>
    );
}
