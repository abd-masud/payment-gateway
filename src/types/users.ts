export interface Users {
    key: string;
    id: number;
    name: string;
    email: string;
    contact: string;
    role: string;
    type: string;
    company: string;
    url: string;
    logo: string;
    image: string;
    status: string;
    password: string;
    vendor_id: string;
    merchant_id: string;
    vn_id: number;
}

export type UserApiResponse = {
    success: boolean;
    data: Users[];
    message?: string;
};

export interface UsersTableProps {
    users: Users[];
    loading: boolean;
    fetchUsers: () => void;
}

export interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: Users | null;
    onSave: (updatedUser: Users) => Promise<void>;
}

export interface UsersReportButtonProps {
    users: Users[];
}
