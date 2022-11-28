import React, {useState} from 'react'

import axios from "axios";

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';


export default function ModifyDetails() {

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
        dict.password=document.getElementById("password").value
        dict.name=document.getElementById("name").value
        dict.dob=document.getElementById("dob").value
        dict.location=document.getElementById("location").value
        dict.description=document.getElementById("description").value
        dict.email=document.getElementById("email").value
        dict.phoneno=document.getElementById("phoneno").value

        // const formData = new FormData();
        // formData.append("password", dict.password);
        // formData.append("name", dict.name);
        // formData.append("dob", dict.dob);
        // formData.append("location", dict.location);
        // formData.append("description", dict.description);
        // formData.append("email", dict.email);
        // formData.append("phoneno", dict.phoneno);

        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        axios({
            method: "post",
            url: url+"/expert/modifyDetails",
            data: JSON.stringify(dict),
            withCredentials: true,
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
        //   console.log(response);
          setresponse(response.data.messages);
        })
        .catch(function (error) {
        //   console.log(error.response.data.messages);
          setresponse(error.response.data.messages);
        });
    }



    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
                <div className="mb-3">
                    <label className="form-label">New Password</label>
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
