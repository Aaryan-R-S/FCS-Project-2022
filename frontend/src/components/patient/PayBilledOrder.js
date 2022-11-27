import React, {useState} from 'react'


export default function PayBilledOrder() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.orderid=document.getElementById("orderid").value
        dict.otp=document.getElementById("otp").value

        const formData = new FormData();
        formData.append("orderid", dict.orderid);
        formData.append("otp", dict.otp);
       
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
                <label className="form-label">Order ID</label>
                <input type="text" className="form-control" id="orderid"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">OTP</label>
                    <input type="number" className="form-control" id="otp"/>
                </div>
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
