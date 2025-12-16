import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: { className: "text-center font-semibold text-gray-900" },
    }),
    columnHelper.accessor("image", {
      header: "Image",
      meta: { className: "text-center" },
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-md shadow cursor-pointer"
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      meta: { className: "text-center" },
      cell: ({ row }) => (
        <div className="flex justify-center gap-2 flex-wrap">
          {row.original.category.map((c) => (
            <span
              key={c._id}
              className="px-2 py-1 bg-green-100 rounded-md text-green-800 font-semibold text-[10px] sm:text-xs break-words"
            >
              {c.name}
            </span>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      meta: { className: "text-center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-2 bg-white border border-green-500 rounded-full hover:bg-green-100"
          >
            <HiPencil size={18} className="text-green-700" />
          </button>

          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true);
              setDeleteSubCategory(row.original);
            }}
            className="p-2 bg-white border border-red-500 rounded-full hover:bg-red-100"
          >
            <MdDelete size={18} className="text-red-600" />
          </button>
        </div>
      ),
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full">

      {/* HEADER */}
      <header className="w-full bg-white shadow-md p-3 mb-5 flex items-center justify-center relative">
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-green-800 uppercase tracking-widest">
          Sub Category
        </h2>

        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="font-semibold text-xs sm:text-sm min-w-16 sm:min-w-20 
                    border border-green-600 text-green-800 hover:text-white hover:bg-green-700 
                    px-2 py-1 sm:px-3 sm:py-1 rounded-full absolute right-4"
        >
          Add Sub Category
        </button>
      </header>

      {/* TABLE WITH HORIZONTAL SCROLL */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <DisplayTable data={data} column={column} />
        </div>
      </div>

     

      {/* MODALS */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
