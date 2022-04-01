import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../auth/userProvider';
import Modal from '../modal';
import Processorder from '../process-order';
import './order.css';
import configs from "../configs.json";

function Order({ orderNumber = 1, customerNumber = 1, onNewOrder = () => { } }) {

    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [productSearchValue, setProductSearchValue] = useState("");
    const [productSearchFocus, setProductSearchFocus] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [order, setOrder] = useState([]);
    const [user, setUser] = useContext(UserContext);

    function toggleModal() {
        setModal(!modal);
    }

    function orderProduct(evt) {
        evt.preventDefault();
        const existingProductIndex = order.findIndex(p => p.code === selectedProduct.code);
        if (existingProductIndex > -1) {
            setOrder(order.map((p, i) => {
                if (i === existingProductIndex) {
                    p.qty += selectedProduct.qty;
                }
                return p;
            }));
        }
        else {
            setOrder([...order, selectedProduct])
        }
        setSelectedProduct(null);
    }

    function orderProcessed(purchaseOrder) {
        toggleModal();
        onNewOrder(purchaseOrder);
        setOrder([]);
    }

    function payOrder(){
        if(order.length){
            toggleModal();
        }
        else{
            alert("No items in the order");
        }
    }

    useEffect(() => {

        if (user == null) {
            navigate("/")
        }

        fetch(`${configs.api_endpoint}/products`)
            .then(resp => resp.json())
            .then((products) => {
                setSearchedItems(products.filter(product => product.name.toLowerCase().substring(0, productSearchValue.length) === productSearchValue.toLowerCase()));
            });

    }, [productSearchValue, user]);


    return (
        <>
            {/* Process Order Modal */}
            {modal && <Modal
                component={<Processorder
                    order={{ products: order }}
                    onProcess={(purchaseOrder) => orderProcessed(purchaseOrder)}
                    customerNumber={customerNumber}
                />}
                dismiss={toggleModal}
            />}
            {/* End process order modal */}

            {/* Set Quantity form */}
            {selectedProduct && <Modal component={
                <form className="pos-padding-10" onSubmit={orderProduct}>
                    <h3>{selectedProduct.name}</h3>
                    <div className="form-group pos-display-flex pos-flex-center pos-padding-0 pos-flex-justify-between">
                        <label>Quanitity</label>
                        <input type="number" autoFocus min={1} max={selectedProduct.stock} value={selectedProduct.qty} onChange={(event) => setSelectedProduct({ ...selectedProduct, qty: Number(event.target.value) })} />
                    </div>
                    <div className="pos-display-flex pos-flex-center pos-padding-0 pos-flex-justify-between">
                        <h4>Total:</h4>
                        <h2>{selectedProduct.ratail_price * selectedProduct.qty}</h2>
                    </div>
                    <div>
                        <button className="pos-btn">Order</button>
                    </div>
                </form>
            } dismiss={() => setSelectedProduct(null)} />}
            {/* End set quanitity form */}

            <div className="pos-display-flex pos-flex-justify-center pos-padding-10">
                <div className="pos-align-self-center pos-w-80">

                    <div className="form-group pos-display-flex pos-padding-0">
                        <input type="text" placeholder="Search Product" className="pos-w-60"
                            value={productSearchValue}
                            onChange={(event) => setProductSearchValue(event.target.value)}
                            onFocus={() => setProductSearchFocus(true)}
                            onBlur={() => setTimeout(() => setProductSearchFocus(false), 200)}
                        />

                        <div className="pos-w-40">
                            <select className="pos-w-100">
                                <option>Filter By</option>
                            </select>
                        </div>
                        {productSearchFocus && <div className="search-results pos-w-80">
                            {searchedItems.map(product => <a key={product.id} onClick={() => setSelectedProduct({ ...product, qty: 1 })} >
                                <div>{product.name}</div>
                                <div className="pos-w-40">Code: {product.code}</div>
                            </a>)}
                        </div>}
                    </div>

                    <div className="pos-card">
                        <h3 className="pos-card-header ">Order</h3>
                        <hr />
                        <div className="pos-card-body ">
                            <table className="pos-table pos-table-bordered">
                                <tbody>
                                    {order.length ? order.map(p => <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.qty}</td>
                                        <td align="right"><strong>{p.ratail_price * p.qty}</strong></td>
                                    </tr>) : <tr>
                                        <td align='center'>
                                            <h3>No items ordered</h3>
                                            <p>Search for products and add them in the order<br/>
                                            then click "Pay Order" to complete an order</p>
                                        </td>
                                    </tr>}
                                </tbody>
                            </table>
                        </div>
                        <hr />

                        <div className="pos-card-footer pos-display-flex pos-flex-justify-between pos-flex-center">
                            <button type="button" className="pos-btn" onClick={payOrder}>Pay Order</button>
                            <h2 className="pos-padding-0">Total: {order.reduce((a, b) => a + (b.ratail_price * b.qty), 0).toFixed(2)}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order;