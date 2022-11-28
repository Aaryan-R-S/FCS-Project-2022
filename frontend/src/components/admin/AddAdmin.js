import React, {useState} from 'react';
import axios from "axios";

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function AddAdmin() {

    const [response, setresponse] = useState();

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
        dict.username=document.getElementById("username").value;
        dict.password=document.getElementById("pass").value;
        // console.log(dict)
        let url =  (process.env.REACT_APP_NODE_ENV === "prod"? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_DEV_URL);
        let a = axios.create({
            baseURL: url,
        });
        a.post(
            "/admin/addAdmin",
            JSON.stringify({ username:dict.username, password:dict.password }),
            {
                withCredentials: true,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
            }
            )
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
                    <label className="form-label">Username</label>
                    <input type="number" className="form-control" id="username"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input value={password} type="password" disabled className="form-control" id="pass"/>
                </div>
                <div className="mb-3" style={{color:'black'}}>
                    <Keyboard layoutName={layout} onChange={onChange} onKeyPress={onKeyPress}/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Add Admin</button>

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
