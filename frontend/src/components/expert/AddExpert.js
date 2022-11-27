import React, {useState} from 'react'


export default function AddExpert() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.licenseno=document.getElementById("licenseno").value
        dict.password=document.getElementById("password").value
        dict.who=document.getElementById("who").value
        dict.name=document.getElementById("name").value
        dict.dob=document.getElementById("dob").value
        dict.location=document.getElementById("location").value
        dict.description=document.getElementById("description").value
        dict.email=document.getElementById("email").value
        dict.phoneno=document.getElementById("phoneno").value
        dict.doctype=document.getElementById("doctype").value
        dict.file1=document.getElementById("file1").files[0].name
        dict.file2=document.getElementById("file2").files[0].name
        dict.file3=document.getElementById("file3").files[0].name

        const formData = new FormData();
        formData.append("licenseno", dict.licenseno);
        formData.append("password", dict.password);
        formData.append("who", dict.who);
        formData.append("name", dict.name);
        formData.append("dob", dict.dob);
        formData.append("location", dict.location);
        formData.append("description", dict.description);
        formData.append("email", dict.email);
        formData.append("phoneno", dict.phoneno);
        formData.append("doctype", dict.doctype);
        formData.append("file1", document.getElementById("file1").files[0])
        formData.append("file2", document.getElementById("file2").files[0])
        formData.append("file3", document.getElementById("file3").files[0])

        // Write API here (data required)
        const res=""
        // const res = await fetch("http://localhost:3500/patient/addPatient", {
        //     method: "POST",
        //     body: formData,
        // }).then((res) => res.json());
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
            <label className="form-label">License No</label>
            <input type="number" className="form-control" id="licenseno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" id="password"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Who</label>
                    <input type="text" className="form-control" id="who"/>
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
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" id="location"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" id="description"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input type="email" className="form-control" id="email"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phoneno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document Type</label>
                    <input type="text" className="form-control" id="doctype"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document 1</label>
                    <input type="file" className="form-control" id="file1"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document 2</label>
                    <input type="file" className="form-control" id="file2"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Document 3</label>
                    <input type="file" className="form-control" id="file3"/>
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
