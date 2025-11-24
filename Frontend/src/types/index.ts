export interface LoginFormValues {
    email: string;
    password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}


export interface LoginError {
    message: string;
}

export interface SignupFormValues {
    username: string,
    email: string,
    password: string,
    confirm_password: string,
}

export interface SignupResponse {
    message: string;
    token?: string;
}

export interface SignupError {
    message: string;
}

export interface CreateDocumentFormValues {
    title: string,
    content: string,
}

export interface Collaborator {
    userid: string;
    role: number;
}

export interface CreateDocumentApiResponse {
    message: string;
    document: {
        title: string,
        content: string,
        ownerId: string,
        _id: string,
        collaborators: Collaborator[],
        createdAt: string,
        updatedAt: string,
        __v: number
    }
}

export interface CreateDocumentApiError {
    message: string;
}

export interface UpdateDocumentFormValues {
    title: string,
    content: string,
}

export interface UpdateDocumentApiResponse {
    message: string;
    document: {
        title: string,
        content: string,
        ownerId: string,
        _id: string,
        collaborators: Collaborator[],
        createdAt: string,
        updatedAt: string,
        __v: number
    }
}

export interface UpdateDocumentApiError {
    message: string;
}

export interface CreateCollaboratorsFormValues {
    userid: { value: string; label: string }[];
    role: { value: number; label: string };
}

export interface CreateCollaboratorsApiResponse {
    message: string;
    document: {
        title: string,
        content: string,
        ownerId: string,
        _id: string,
        collaborators: Collaborator[],
        createdAt: string,
        updatedAt: string,
        __v: number
    }
}

export interface CreateCreateCollaboratorsApiError {
    message: string;
}


