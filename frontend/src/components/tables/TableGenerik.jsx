import React from "react";
import { Table, Button } from "react-bootstrap";

const TableGenerik = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    {onEdit && (
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row)}
                      >
                        Hapus
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableGenerik;