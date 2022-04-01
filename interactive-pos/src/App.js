import { TopNav } from "./TopNav";
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import Login from "./auth/Login";
import Order from "./order/Order";
import { useContext, useEffect, useState } from "react";
import Orders from "./orders/orders";
import { UserContext } from "./auth/userProvider";


function App() {

  const base = '';

  const [user, setUser] = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [customerNumber, setCustomerNumber] = useState(1);
  const navigate = useNavigate();

  function newOrder(order) {
    setOrders([...orders, order]);
    setCustomerNumber(customerNumber + 1);
  }

  function checkoutOrder(order) {
    setOrders(orders.map((o, i) => {
      if (o.orderNumber === order.orderNumber) {
        o.checkedOut = true;
      }
      return o;
    }));
  }

  function signout() {
    sessionStorage.removeItem("user");
    setUser(null);
  }

  /* if(sessionStorage.getItem("user")){
    setUser(JSON.parse(sessionStorage.getItem("user")));
  } */

  return (
    <div>
      <TopNav onSignOut={signout} base={base} />
      <Routes>
        <Route path={base + '/'} element={<Login />} />
        <Route
          path={base + "/order"} element={<Order
            orderNumber={orders.length + 1}
            customerNumber={customerNumber}
            onNewOrder={newOrder}
            base={base}
          />} />
        <Route path={base + "/orders"} element={<Orders onCheckout={checkoutOrder} />} />
        <Route path="**" element={<div>404 Page not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
