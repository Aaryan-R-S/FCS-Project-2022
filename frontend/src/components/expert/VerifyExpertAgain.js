import React, {useState} from 'react'


export default function VerifyExpertAgain() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value
        dict.file=document.getElementById("file").files[0].name

        const formData = new FormData();
        formData.append("licenseno", dict.licenseno);
        formData.append("file", document.getElementById("file").files[0])

        //Write api here (data needed)
        let res

        // console.log(res)
        setresponse(res)
    }



    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
            
                <div className="mb-3">
                <label className="form-label">License No.</label>
                <input type="number" className="form-control" id="licenseno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document</label>
                    <input type="file" className="form-control" id="file"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Verify</button>

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
