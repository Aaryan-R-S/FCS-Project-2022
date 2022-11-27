import React, {useState} from 'react'

export default function ListSharedDoc() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        // var dict = {};
        var res

        // write api here (no input)


        // console.log(res)
        setresponse(res)
    }



    return (
    <>

        <div className="container px-4 text-center">
        <div className="row gx-5">
            <div className="col">
            
                <button className="btn btn-primary" onClick={submit}>List Shared Documents</button>

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
