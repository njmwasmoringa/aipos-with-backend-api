import { useState } from "react";
import configs from "./configs.json";

function Processorder({ order: { products }, onProcess = () => { }, customerNumber }) {
    const total = products.reduce((a, b) => a + (b.ratail_price * b.qty), 0);
    const [amount, setAmount] = useState(total);
    const [customers, setCustomers] = useState(null);
    const [paymentMode, setPaymentMode] = useState("cash");
    const [processing, setProcessing] = useState(false);
    const date = new Date();
    const [order, setOrder] = useState({
        products,
        orderNumber: (date.toDateString()+date.toTimeString().split(" ").shift()).replace(/[^0-9]/gi, ""),
        customer:{
            name:`Customer No# ${customerNumber}`,
            phone: ''
        },
        total
    });

    function processOrder(event) {
        event.preventDefault();
        setProcessing(true);
        fetch(`${configs.api_endpoint}/order`, {
            method:'POST',
            body: JSON.stringify({...order, products:order.products.map(p=>({id:p.id, qty:p.qty}))}),
            headers: {
            "Content-Type":"application/json"
            }
        })
        .then(resp=>resp.json())
        .then(o=>{
            setProcessing(false);
            onProcess({...order, id:o.id})
        })
        .catch(e=>{
            console.log(e);
        });
    }

    return (
        <form className="pos-padding-10" onSubmit={processOrder}>
            <h3>Order No# {order.orderNumber}</h3>
            Total Amount:
            <h1 className="pos-margin-0">{total.toFixed(2)}</h1>
            <div className="form-group">
                <label>Amount Paid</label>
                <input type="number" required autoFocus min={0} step=".01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
            </div>
            <h3 className="pos-margin-0">Change: {(amount > total ? amount - total : 0).toFixed(2)}</h3>
            
            <div className="form-group pos-margin-0">
                <label>Payment Method</label>
                <div className="pos-display-flex pos-padding-0">
                    <label style={{paddingRight:"10px"}}><input name="paymentMethod" type="radio" value="cash" checked={paymentMode == "cash"} onChange={() => setPaymentMode("cash")} /> Cash</label>
                    <span>&nbsp;</span>
                    <label style={{paddingRight:"10px"}}><input name="paymentMethod" type="radio" value="mpesa" checked={paymentMode == "mpesa"} onChange={() => setPaymentMode("mpesa")} /> Mpesa</label>
                    <span>&nbsp;</span>
                    <label style={{paddingRight:"10px"}}><input name="paymentMethod" type="radio" value="credit" checked={paymentMode == "credit"} onChange={() => setPaymentMode("credit")} /> Credit</label>
                </div>
            </div>

            <hr/>

            <div className="form-group">
                <label>Customer Name / Phone Number</label>
                <input type="text" value={order.customer.name} onChange={(event) => { setOrder({ ...order, customer: {...order.customer, name: event.target.value} }) }} />
            </div>

            {paymentMode != "cash" && <div className="form-group">
                <label>Customer Phone Number</label>
                <input type="tel" required value={order.customer.phone} onChange={(evt)=>setOrder({...order, customer:{...order.customer, phone:evt.target.value}})} />
            </div>}
            <hr />
            <div className="form-group">
                {!processing && <button className="pos-btn">Process</button>}
                {processing && <span>Prcessing Order</span>}
            </div>
        </form>
    );
}

export default Processorder;