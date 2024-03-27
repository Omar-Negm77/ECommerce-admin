import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get("/api/contact").then((response) => setMessages(response.data));
  }, []);
  return (
    <Layout>
      <h1>Messages</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Sender</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 &&
            messages.map((message) => (
              <>
                <tr>
                  {/* message.createdAt.replace("T", " ").substring(1, 16) */}
                  <td>{message.date.replace("T", " ").substring(1, 16)}</td>
                  <td>
                    {message.name} {message.email}
                  </td>
                  <td>{message.message}</td>
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
