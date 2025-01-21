import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ authToken }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://dev208979.service-now.com",
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setData(response.data.result);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, [authToken]);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {data.map((item) => (
                    <li key={item.sys_id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
