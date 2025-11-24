import type { CreateCollaboratorsFormValues, CreateDocumentFormValues, LoginFormValues, SignupFormValues } from "../types";
import HttpService from "./interceptors";

// auth api
export const LoginAPI = async (values: LoginFormValues) => await HttpService.post("/login", values);
export const SignupAPI = async (values: SignupFormValues) => await HttpService.post("/register", values);

// docs api
export const MyDocumentListApi = async ({ queryKey }: { queryKey: [string, number, string] }) => {
    const [, page, search] = queryKey;
    return await HttpService.get(
        `/myDocument?limit=10&page=${page}&search=${search}`
    );
};
export const DocumentDeleteApi = async (values: number) => await HttpService.delete(`/myDocument/${values}`);
export const CreateDocumentApi = async (values: CreateDocumentFormValues) => await HttpService.post("/createDocument", values);
export const CreateApi = async (values: CreateDocumentFormValues) => await HttpService.post("/createDocument", values);

// Collaborators api
export const CreateCollaboratorsApi = async ({
    id,
    values,
}: {
    id: string;
    values: { collaborators: { role: number; userid: string }[] };
}) => {
    return await HttpService.post(`/collaborators/create/${id}`, values);
};

// user api
export const userListApi = async () => await HttpService.get("/users");

export const UpdateDocumentApi = async ({
    id,
    values,
}: {
    id: string;
    values: { title: string, content: string };
}) => {
    return await HttpService.put(`/myDocument/${id}`, values);
};

export const DocumentViewApi = async (id: number) => await HttpService.get(`/myDocument/${id}`);


