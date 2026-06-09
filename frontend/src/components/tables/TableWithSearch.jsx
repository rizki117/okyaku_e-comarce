import React, { useState } from "react";
import { Form } from "react-bootstrap";
import TableGenerik from "./TableGenerik";

const TableWithSearch = ({ columns, data, searchKey, ...props }) => {
  const [query, setQuery] = useState("");

  const filteredData = data.filter((row) =>
    row[searchKey].toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <Form.Control
        type="text"
        placeholder={`Cari berdasarkan ${searchKey}...`}
        className="mb-3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <TableGenerik columns={columns} data={filteredData} {...props} />
    </div>
  );
};

export default TableWithSearch;