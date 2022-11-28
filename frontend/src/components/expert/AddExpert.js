import React, {useState} from 'react'

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function AddExpert() {

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
        dict.licenseno=document.getElementById("licenseno").value
        dict.password=document.getElementById("password").value
        dict.who=document.getElementById("who").value
        dict.name=document.getElementById("name").value
        dict.dob=document.getElementById("dob").value
        dict.location=document.getElementById("location").value
        dict.description=document.getElementById("description").value
        dict.email=document.getElementById("email").value
        dict.phoneno=document.getElementById("phoneno").value
        // dict.file=
        // console.log(dict);

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
        formData.append("doctype", "licenseno");
        formData.append("file", document.getElementById("file").files[0]);
        console.log(document.getElementById("file").files[0]);

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL)

        const res = await fetch(`${url}/expert/addExpert`, {
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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Must be a professional, hospital, pharmacy or insurancefirm
        </Tooltip>
    );

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
                    <input value={password} type="password" disabled className="form-control" id="password"/>
                </div>
                <div className="mb-3" style={{color:'black'}}>
                    <Keyboard layoutName={layout} onChange={onChange} onKeyPress={onKeyPress}/>
                </div>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                    <div className="mb-3">
                        <label className="form-label">Who</label>
                        <input type="text" className="form-control" id="who"/>
                    </div>
                </OverlayTrigger>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" id="name"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">DOB (yyyy-mm-dd)</label>
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
                    <label className="form-label">Document (Licenseno)</label>
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
