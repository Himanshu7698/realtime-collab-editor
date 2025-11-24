import { Fragment, useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CreateDocumentApi } from "../api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import type {
  CreateDocumentApiError,
  CreateDocumentApiResponse,
  CreateDocumentFormValues,
} from "../types";

export default function Editor() {
  const [content, setContent] = useState("description");
  const [title, setTitle] = useState("Doc-1");
  const navigate = useNavigate();

  // Create Document API
  const { mutate: createDocApi } = useMutation<
    AxiosResponse<CreateDocumentApiResponse>,
    AxiosError<CreateDocumentApiError>,
    CreateDocumentFormValues
  >({
    mutationFn: CreateDocumentApi,
    onSuccess: ({ data }: AxiosResponse) => {
      toast.success(data?.message || "Saved successfully");
      navigate("/");
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || "Something went wrong.");
    },
  });

  return (
    <Fragment>
      <div className="container-fluid p-4">
        <div className="d-flex w-100 justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
          <div className="d-flex">
            <button className="btn btn-outline-secondary me-3 text-nowrap" onClick={() => navigate("/")}>
              <FaArrowLeft /> Back
            </button>

            <input
              type="text"
              className="form-control h4 mb-0 border-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>

          <div className="">
            <Button
              onClick={() => createDocApi({ title, content })}
              variant="primary"
            >
              <FaSave className="me-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="custom-card p-4 bg-white shadow-sm rounded">
              <CKEditor
                editor={ClassicEditor as any}
                data={content}
                onChange={(_, editor) => setContent(editor.getData())}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
