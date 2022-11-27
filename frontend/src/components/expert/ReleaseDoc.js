import React, {useState} from 'react'


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

        //Write request here
        const res = ""
        // alert(JSON.stringify(`${res.message}, status: ${res.status}`));
        console.log(res)
        setresponse(res)
    }



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
                    <label className="form-label">Document</label>
                    <input type="file" className="form-control" id="file"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document Type</label>
                    <input type="text" className="form-control" id="doctype"/>
                </div>
                <div className="mb-3">
                <label className="form-label">OTP</label>
                <input type="number" className="form-control" id="otp"/>
                </div>
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
