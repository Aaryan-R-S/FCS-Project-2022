import React, {useState} from 'react'


export default function ModifyDetails() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.password=document.getElementById("password").value
        dict.name=document.getElementById("name").value
        dict.dob=document.getElementById("dob").value
        dict.address=document.getElementById("address").value
        dict.email=document.getElementById("email").value
        dict.phoneno=document.getElementById("phoneno").value

        const formData = new FormData();
        formData.append("password", dict.password);
        formData.append("name", dict.name);
        formData.append("dob", dict.dob);
        formData.append("address", dict.address);
        formData.append("email", dict.email);
        formData.append("phoneno", dict.phoneno);

        const res = await fetch("http://localhost:3500/patient/modifyDetails", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
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
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" id="password"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" id="name"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">DOB in formate yyyy-mm-dd</label>
                    <input type="date" className="form-control" id="dob"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" id="address"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input type="email" className="form-control" id="email"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phoneno"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Submit</button>

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
