import React from "react";
import TableContainer from "../components/tables/TableContainer";
import useFetchData from "../hooks/useFetchData";
import useDeleteData from "../hooks/useDeleteData";
import useEditData from "../hooks/useEditData";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" }
];

const UserPage = () => {
  return (
    <div className="p-3">
      <h2>Daftar User</h2>
      <TableContainer
        fetchHook={useFetchData}
        deleteHook={useDeleteData}
        editHook={useEditData}
        columns={columns}
        formStructure={/* struktur form untuk EditModal */}
      />
    </div>
  );
};

export default UserPage;