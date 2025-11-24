import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DocumentDeleteApi, MyDocumentListApi } from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDateIST } from "../helper/dateFormate";
import type { AxiosError, AxiosResponse } from "axios";

export default function Dashboard() {
  const [page, setPage] = useState<number>(1);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);
  const [docsData, setDocsData] = useState<any[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-document", page, debouncedSearch],
    queryFn: MyDocumentListApi,
  });

  useEffect(() => {
    if (data) {
      setTotalPage(data?.data?.info?.total_page);
      setDocsData(data?.data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (!isFirstLoad) {
      refetch();
    }
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== search) {
        setDebouncedSearch(search);
        if (page !== 1) {
          setPage(1);
        }
      }
    }, 700);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const isDataAvailable = docsData && docsData.length > 0;

  const handleCreateNew = () => navigate("/editor");

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    navigate("/login");
  };

  const { mutate } = useMutation({
    mutationFn: DocumentDeleteApi,
    onSuccess: ({ data }: AxiosResponse) => {
      toast.success(data?.message || "Signup successfully");
      refetch();
    },
    onError: ({ response }: AxiosError<{ message: string }>) => {
      toast.error(response?.data?.message || "Something went wrong.");
    },
  });

  return (
    <Fragment>
      <div className="dashboard-header py-4 bg-primary text-white mb-4 shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0 fw-bold">
              <SiGoogledocs /> DocMaster Dashboard
            </h1>
            <button className="btn btn-light" onClick={handleLogout}>
              <MdLogout />
              Logout
            </button>
          </div>

          <div className="mt-3 row g-2">
            <div className="col-md-9">
              <input
                type="search"
                className="form-control form-control-lg"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-success btn-lg w-100"
                onClick={handleCreateNew}
              >
                <FaPlus /> Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h4 className="mb-3 text-secondary">
          Your Documents ({docsData?.length})
        </h4>
        <div className="card shadow-sm border-0 p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Sr no</th>
                  <th>Document Name</th>
                  <th className="d-none d-md-table-cell">Permission</th>
                  <th>Last Modified</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              {!isLoading && isDataAvailable ? (
                <tbody>
                  {docsData.map((item: any, i: number) => (
                    <tr key={i}>
                      <td>{i + 1 + (page - 1) * 10}</td>
                      <td style={{ cursor: "pointer" }}>
                        <strong>{item?.title || "-"}</strong>
                      </td>

                      <td className="d-none d-md-table-cell">
                        {item.ownerId?._id === user_id ? (
                          <span className="badge bg-primary">Owner</span>
                        ) : item.collaborators?.length > 0 ? (
                          item.collaborators
                            .filter((collab: any) => collab.userId?._id === user_id)
                            .map((collab: any) => (
                              <span key={collab._id} className="badge bg-secondary me-1">
                                {collab.role}
                              </span>
                            ))
                        ) : (
                          <span className="badge bg-secondary">No Role</span>
                        )}
                      </td>


                      <td>{formatDateIST(item?.updatedAt)}</td>

                      <td>
                        <div className="my-2 d-flex justify-content-center align-items-center flex-grow-1">
                          <button className="bg-transparent border-0 p-0 ms-2" onClick={() => navigate(`/update/docs/${item._id}`)}>
                            <FaEdit className="h5 text-primary mb-0 cursor-pointer" />
                          </button>
                          <button className="bg-transparent border-0 p-0 mx-2">
                            <FaTrashCan onClick={() => mutate(item?._id)} className="h6 text-danger mb-0 cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : null}
            </table>
            {(isLoading || !isDataAvailable) && (
              <div className="p-5 text-center">
                {isLoading ? (
                  <>
                    <i className="fa fa-spinner fa-spin fa-3x" style={{ color: "#0d6efd" }}></i>
                    <p className="mt-3 text-muted">Loading job data...</p>
                  </>
                ) : (
                  <div className="text-center text-muted py-4 fs-5">
                    No documents found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPage ? (
          <div className="d-flex justify-content-center mt-4">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next ›"
              previousLabel="‹ Prev"
              pageCount={totalPage}
              onPageChange={(pageClicked) => setPage(pageClicked.selected + 1)}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              nextClassName="page-item"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              activeClassName="active"
              disabledClassName="disabled"
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
            />
          </div>
        ) : null}
      </div>
    </Fragment>
  );
}
