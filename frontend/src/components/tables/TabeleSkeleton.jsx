import React from "react";
import { Table, Placeholder } from "react-bootstrap";

const TableSkeleton = ({ columns, rows = 5 }) => {
  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="table-dark">
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>
                <Placeholder as="span" animation="wave">
                  <Placeholder xs={6} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableSkeleton;