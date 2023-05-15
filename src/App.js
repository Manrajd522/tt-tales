import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";

const App = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://www.terriblytinytales.com/test.txt"
      );
      const textContent = response.data;
      setContent(textContent);
      const words = textContent.trim().split(/\s+/);
      const wordCounts = words.reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
      }, {});
      const sortedWords = Object.entries(wordCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const top20Words = sortedWords
        .slice(0, 20)
        .map(([word, count]) => ({ word, count }));
      setDataPoints(top20Words);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      dataPoints.map((row) => Object.values(row).join(",")).join("\n");
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
  };
  
  return (
    <div className="container">
      <button className="button" onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {content && <pre className="content">{content}</pre>}
      {dataPoints.length > 0 && (
        <div className="chart-container">
          <BarChart width={600} height={400} data={dataPoints}>
            {/* ... */}
          </BarChart>
          <button className="export-button" onClick={exportToCSV}>
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
