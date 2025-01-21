import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ authToken }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "https://your-instance.service-now.com/api/now/table/concert_entry",
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setData(response.data.result);
                setFilteredData(response.data.result);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();
    }, [authToken]);

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Dashboard</h2>
            {loading && <p>Loading data...</p>}
            {error && <p style={styles.error}>{error}</p>}
            {!loading && !error && (
                <>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearch}
                        style={styles.search}
                    />
                    <ul style={styles.list}>
                        {filteredData.map((item) => (
                            <li key={item.sys_id} style={styles.listItem}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

// Basic styles for the component
const styles = {
    container: {
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        textAlign: "center",
        color: "#333",
    },
    search: {
        marginBottom: "20px",
        padding: "10px",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    listItem: {
        padding: "10px",
        borderBottom: "1px solid #ccc",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
};

export default Dashboard;