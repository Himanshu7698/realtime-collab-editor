import { Fragment, useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaShareAlt } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import {
    CreateCollaboratorsApi,
    DocumentViewApi,
    UpdateDocumentApi,
    userListApi,
} from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import type {
    CreateCollaboratorsApiResponse,
    CreateCreateCollaboratorsApiError,
    UpdateDocumentApiError,
    UpdateDocumentApiResponse,
    UpdateDocumentFormValues,
} from "../types";


export default function Update() {
    const [content, setContent] = useState("description");
    const [title, setTitle] = useState("Doc-1");
    const [showShare, setShowShare] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = localStorage.getItem("user_id");

    // Fetch User List  
    const { data } = useQuery({
        queryKey: ["get-user-list"],
        queryFn: userListApi,
    });

    // Document API
    const { data: documentViewData } = useQuery({
        queryKey: ["get-document-data", id],
        queryFn: () => DocumentViewApi(id as any),
    });

    // Set values after data load

    useEffect(() => {
        if (documentViewData?.data) {
            setTitle(documentViewData?.data?.title);
            setContent(documentViewData?.data?.content);
        }
    }, [documentViewData]);

    // Create collaborators API
    const { mutate: createCollaboratorsApi } =
        useMutation<
            AxiosResponse<CreateCollaboratorsApiResponse>,
            AxiosError<CreateCreateCollaboratorsApiError>,
            { id: string; values: { collaborators: { role: number; userid: string }[] } }
        >({
            mutationFn: CreateCollaboratorsApi,
            onSuccess: ({ data }) => {
                toast.success(data?.message || "Collaborators saved successfully");
            },
            onError: ({ response }) => {
                toast.error(response?.data?.message || "Something went wrong.");
            },
        });

    // Create Document API
    const { mutate: UpdateDocApi } = useMutation<
        AxiosResponse<UpdateDocumentApiResponse>,
        AxiosError<UpdateDocumentApiError>,
        { id: string; values: UpdateDocumentFormValues }
    >({
        mutationFn: UpdateDocumentApi,
        onSuccess: ({ data }: AxiosResponse) => {
            toast.success(data?.message || "Update successfully");
            navigate("/");
        },
        onError: ({ response }) => {
            toast.error(response?.data?.message || "Something went wrong.");
        },
    });

    const roleOptions = [
        { value: 0, label: "Viewer" },
        { value: 1, label: "Editor" },
        { value: 2, label: "Owner" },
    ];

    const userOptions =
        data?.data?.data
            ?.filter((user: any) => user._id !== userId)   
            .map((user: any) => ({
                value: user._id,
                label: user.email,
            })) || [];


    return (
        <Fragment>
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
                    <div className="d-flex">
                        <button className="text-nowrap btn btn-outline-secondary me-3" onClick={() => navigate("/")}>
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
                    <div className="d-flex gap-2">
                        <Button variant="secondary" onClick={() => setShowShare(true)}>
                            <FaShareAlt /> Share
                        </Button>

                        <Button
                            onClick={() =>
                                UpdateDocApi({
                                    id: String(id),
                                    values: { title, content },
                                })
                            }
                            variant="primary"
                        >
                            <FaSave className="me-2" />
                            Update
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

            {/* ==================== SHARE MODAL ==================== */}
            <Modal show={showShare} onHide={() => setShowShare(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Share Document</Modal.Title>
                </Modal.Header>

                <Formik
                    initialValues={{ role: null, userid: [] }}
                    // validationSchema={ShareSchema}
                    onSubmit={(values: any) => {

                        console.log(values)
                        const collaborators = values.userid.map((item: any) => ({
                            role: values.role?.value!,
                            userid: item.value,
                        }));

                        createCollaboratorsApi({
                            id: String(id),
                            values: { collaborators },
                        });

                        setShowShare(false);
                    }}
                >
                    {({ setFieldValue, errors, touched }) => (
                        <Form>
                            <Modal.Body>
                                <label className="fw-bold mb-1">Select Role</label>
                                <Select
                                    options={roleOptions}
                                    onChange={(val) => setFieldValue("role", val)}
                                    placeholder="Select role..."
                                />
                                {errors.role && touched.role && (
                                    <div className="text-danger small mt-1">{errors.role as any}</div>
                                )}

                                <label className="fw-bold mt-3 mb-1">Select Emails</label>
                                <Select
                                    options={userOptions}
                                    isMulti
                                    onChange={(val) => setFieldValue("userid", val)}
                                    placeholder="Select users..."
                                />

                                {errors.userid && touched.userid && (
                                    <div className="text-danger small mt-1">{errors.userid as any}</div>
                                )}
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowShare(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Share
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </Fragment>
    );
}
