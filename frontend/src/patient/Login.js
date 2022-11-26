import React, {useState} from 'react'


export default function Login() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.healthid=document.getElementById("healthid").value
        dict.password=document.getElementById("pass").value
        console.log(dict)

        // const formData = new FormData();
        // formData.append("healthid", dict.healthid);
        // formData.append("password", dict.pass);

        const res=await fetch('http://localhost:3500/patient/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            body: JSON.stringify(dict)
        }).then((res) => res.json())

        // const res = await fetch("http://localhost:3500/patient/login", {
        //     method: "POST",
        //     body: formData,
        // }).then((res) => res.json());
        // // alert(JSON.stringify(`${res.message}, status: ${res.status}`));
        // console.log(res)
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
                    <label className="form-label">Password</label>
                    <input type="text" className="form-control" id="pass"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Submit</button>

            </div>
            <div className="col">
            <div className="p-3 border bg-light">Response</div>
            {JSON.stringify(response)}
            </div>
        </div>
        </div>
    </>
    );
}
