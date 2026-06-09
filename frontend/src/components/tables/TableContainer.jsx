import React, { useState } from "react";
import TableGenerik from "./TableGenerik";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import ConfirmDelete from "../common/ConfirmDelete";
import EditModal from "../common/EditModal";
import SuccessAlert from "../common/SuccessAlert";

const TableContainer = ({
  fetchHook,
  deleteHook,
  editHook,
  columns,
  formStructure
}) => {
  // Fetch data
  const { data, setData, loading, error } = fetchHook();

  // Delete
  const { itemToDelete, setItemToDelete, handleDelete, successMessage: deleteSuccess } = deleteHook(setData);

  // Edit
  const { itemToEdit, setItemToEdit, handleEdit, successMessage: editSuccess } = editHook(setData);

  if (loading) return <Loading message="Memuat data..." />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {/* Notifikasi */}
      {deleteSuccess && <SuccessAlert message={deleteSuccess} />}
      {editSuccess && <SuccessAlert message={editSuccess} />}

    

      {/* Tabel */}
      <TableGenerik
        columns={columns}
        data={data}
        onEdit={setItemToEdit}
        onDelete={setItemToDelete}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDelete
        itemToDelete={itemToDelete}
        onConfirm={() => {
          handleDelete(itemToDelete.uuid);
          setItemToDelete(null);
        }}
        onCancel={() => setItemToDelete(null)}
        message={`Apakah Anda yakin ingin menghapus ${itemToDelete?.name}?`}
      />

      {/* Modal Edit */}
      <EditModal
        show={!!itemToEdit}
        itemToEdit={itemToEdit}
        onConfirm={(updatedData) => {
          handleEdit(updatedData);
          setItemToEdit(null);
        }}
        onCancel={() => setItemToEdit(null)}
        formStructure={formStructure}
      />
    </div>
  );
};

export default TableContainer;