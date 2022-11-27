import React, {useState} from 'react'


export default function MakeInsuranceClaim() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value
        dict.documentid=document.getElementById("documentid").value

        const formData = new FormData();
        formData.append("licenseno", dict.licenseno);
        formData.append("documentid", dict.documentid);
       
        //Write api here (data needed)
        const res = ""
        

        console.log(res)
        setresponse(res)
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
                    <label className="form-label">Document ID</label>
                    <input type="text" className="form-control" id="documentid"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Submit Claim</button>

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
