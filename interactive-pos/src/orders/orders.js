import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../auth/userProvider";
import Modal from "../modal";
import configs from '../configs.json';

function Orders({ onCheckout = ()=>{} }) {
    
    const navigate = useNavigate();
    
    const [checkoutOrder, setCheckoutOrder] = useState(null);
    const [user, setUser] = useContext(UserContext);
    const [checkingOut, setCheckingOut] = useState(false);
    const [orders, setOrders] = useState([]);
    
    function checkout(){
        fetch(`${configs.api_endpoint}/order/checkout`, {
            method:"PATCH",
            body:JSON.stringify({id:checkoutOrder.id, status:"checked_out"}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(resp=>resp.json())
        .then(o=>{
            setCheckoutOrder(null);
            setOrders(orders.map(order=>{
                if(order.id === o.id){
                    order.status = o.status;
                }
                return order;
            }));
            getOrders()
        })
        .catch(console.log);
    }

    function getOrders(){
        fetch(`${configs.api_endpoint}/orders`).then(resp=>resp.json())
        .then(orders=>{
            setOrders(orders);
        })
    }
    
    useEffect(()=>{
        if(user == null){
            navigate("/")
        }

        getOrders();
    }, [user]);

    return (
        <>
            {checkoutOrder && <Modal component={<div className="pos-padding-10">
                <div className="pos-display-flex pos-padding-0 pos-flex-justify-between">
                    <h4>Order No #{checkoutOrder.order_number}</h4>
                    <h4>{checkoutOrder.customer.name}</h4>
                </div>
                <table className="pos-table pos-table-striped">
                    <thead>
                        <tr>
                            <th>Product name</th>
                            <th>In Stock</th>
                            <th>Quanitity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkoutOrder.order_products.map(p => <tr key={p.id}>
                            <td>{p.product.name}</td>
                            <td align="center">{p.product.stock}</td>
                            <td align="center">{p.quantity}</td>
                        </tr>)}
                    </tbody>
                </table>

                <div>
                    {!checkingOut && checkoutOrder.status == "placed" && <button type="button" className="pos-btn" onClick={checkout}>Checkout</button>}
                    {!checkingOut && checkoutOrder.status == "checked_out" && checkoutOrder.delivery_details != "" && <div>
                        <div>Deliver To: {checkoutOrder.delivery_details}</div>
                        <button type="button" className="pos-btn">Dispatch Order</button>
                    </div>}
                    {checkingOut && <span>Checking out order...</span>}
                </div>
            </div>} dismiss={() => setCheckoutOrder(null)} />}
            

            <div className="pos-page pos-display-flex pos-flex-justify-center pos-padding-10">
                <div className="pos-card pos-w-80">
                <table className="pos-table pos-table-striped">
                    <thead>
                        <tr>
                            <th>Order No</th>
                            <th>Customer</th>
                            <th colSpan={2}>Status</th>
                            {/* <th colSpan={2}>Total</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(o=>!o.checkedOut).map(o => <tr key={o.id}>
                            <td>Order No# {o.order_number}</td>
                            <td>{o.customer.name}</td>
                            <td>{o.status.replace(/_/g, ' ')}</td>
                            {/* <td>{o.total_cost}</td> */}
                            <td align="right">
                                <button type="button" className="pos-btn" onClick={() => setCheckoutOrder(o)}>Details</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}

export default Orders;