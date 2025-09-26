import React, { useEffect, useState } from "react";

const StreamTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch("http://localhost:3080/api/report/sales/stream");
        console.log('dddd', res)
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
    
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
    
          let lines = buffer.split("\n");
          buffer = lines.pop(); // Leave incomplete line for next chunk
    
          for (const line of lines) {
            if (line.trim()) {
              const json = JSON.parse(line);
              // Handle json object here
              console.log("Parsed:", json);
            }
          }
        }
      } catch (err) {
        console.error("Streaming error:", err);
      } finally {
        setLoading(false);
      }
    };    

    fetchStream();

  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Streamed Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length > 0 ? (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              Invoice #: <strong>{tx.invoiceNumber}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default StreamTransactions;
