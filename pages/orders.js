import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => setOrders(response.data));
    // console.log(orders);
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <>
                <tr>
                  {/* order.createdAt.replace("T", " ").substring(1, 16) */}
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country}{" "}
                    {order.streetAddress}
                    <br />
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <>
                        {l.price_data?.product_data.name} * {l.quantity} <br />
                        {/* {JSON.stringify(l)} */}
                      </>
                    ))}
                  </td>
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
