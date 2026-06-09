import React, { useState } from "react";
import { Pagination } from "react-bootstrap";
import TableGenerik from "./TableGenerik";

const TableWithPagination = ({ columns, data, pageSize = 5, ...props }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentData = data.slice(startIdx, endIdx);

  return (
    <>
      <TableGenerik columns={columns} data={currentData} {...props} />
      <div className="d-flex justify-content-center">
        <Pagination>
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === page}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  );
};

export default TableWithPagination;