import React, {useState} from 'react'

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function AddPatient() {

    const [response, setresponse] = useState()

    const [password, setPassword] = useState("");
    const [layout, setLayout] = useState("default");
    
    const onChange = (input) => {
        setPassword(input);
        // console.log("Input changed", input);
    }
    
     const onKeyPress = (button) => {
        // console.log("Button pressed", button);
        if (button === "{shift}" || button === "{lock}") handleShift();
    }

    const handleShift = () => {
        const layoutName = layout;
        setLayout(layoutName === "default" ? "shift" : "default");
    };

    const submit = async () =>{
        var dict = {};
        dict.healthid=document.getElementById("healthid").value;
        dict.password=document.getElementById("password").value;
        dict.name=document.getElementById("name").value;
        dict.dob=document.getElementById("dob").value;
        dict.address=document.getElementById("address").value;
        dict.email=document.getElementById("email").value;
        dict.phoneno=document.getElementById("phoneno").value;
        dict.doctype="healthid";
        dict.file=document.getElementById("file").files[0].name;
        // console.log(dict);
        const formData = new FormData();
        formData.append("healthid", dict.healthid);
        formData.append("password", dict.password);
        formData.append("name", dict.name);
        formData.append("dob", dict.dob);
        formData.append("address", dict.address);
        formData.append("email", dict.email);
        formData.append("phoneno", dict.phoneno);
        formData.append("doctype", dict.doctype);
        // console.log(document.getElementById("file").files[0])
        formData.append("file", document.getElementById("file").files[0])

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)

        const res = await fetch(`${url}/patient/addPatient`, {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        // console.log(res)
        if(res.verdict){
            setresponse(res.messages);
        }
        else{
            setresponse(res.messages);
        }
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
                    <input value={password} type="password" disabled className="form-control" id="password"/>
                </div>
                <div className="mb-3" style={{color:'black'}}>
                    <Keyboard layoutName={layout} onChange={onChange} onKeyPress={onKeyPress}/>
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
                <div className="mb-3">
                    <label className="form-label">Document</label>
                    <input type="file" className="form-control" id="file"/>
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
