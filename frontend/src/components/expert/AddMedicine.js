import React, {useState} from 'react'


export default function AddMedicine() {

    const [response, setresponse] = useState()

    const submit = async () =>{
        var dict = {};
        dict.name=document.getElementById("name").value
        dict.licenseno=document.getElementById("licenseno").value
        dict.price=document.getElementById("price").value
        dict.quantity=document.getElementById("quantity").value

        const formData = new FormData();
        formData.append("name", dict.name);
        formData.append("licenseno", dict.licenseno);
        formData.append("price", dict.price);
        formData.append("quantity", dict.quantity);

        //Write request here
        const res = ""
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
                <label className="form-label">Name</label>
                <input type="text" className="form-control" id="name"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">License No</label>
                    <input type="number" className="form-control" id="licenseno"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" id="price"/>
                </div>
                <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-control" id="quantity"/>
                </div>
                <button className="btn btn-primary" onClick={submit}>Add</button>

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
