import React, {useState} from 'react'


export default function FilterExpert() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.healthid=document.getElementById("who").value
        dict.name=document.getElementById("name").value
        dict.address=document.getElementById("address").value

        const formData = new FormData();
        formData.append("who", dict.who);
        formData.append("name", dict.name);
        formData.append("address", dict.address);

        //Write api here (data needed)
        let res


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
                <label className="form-label">Who</label>
                <input type="text" className="form-control" id="who"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" id="name"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" id="address"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Filter</button>

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
