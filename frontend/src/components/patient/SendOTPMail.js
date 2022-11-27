import React, {useState} from 'react'


export default function SendOTPMail() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value

        const formData = new FormData();
        formData.append("licenseno", dict.licenseno);
       
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
                <button className="btn btn-primary" onClick={submit}>Send OTP</button>

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
