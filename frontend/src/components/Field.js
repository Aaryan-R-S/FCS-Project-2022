import React from 'react'


export default function Field(props) {

    return (
    <>
        <label htmlFor="inputPassword5" className="form-label">{props.field}</label>
        <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock"/>
    </>
    );
}
