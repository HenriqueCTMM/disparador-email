export interface Contact {
  _id?: string;
  name?: string;
  email: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckContactResponse {
  contactExists: boolean;
}

export interface ImportContactsPayload {
  contacts: string[] | string;
  tags: string[];
}

export interface UpdateContactEmailPayload {
  contact: string;
  newEmail: string;
}

export interface RemoveContactsPayload {
  emails: string[];
}

export interface RemoveContactResult {
  email: string;
  deleted: boolean;
  reason?: string;
  message?: string;
}

export interface RemoveContactsResponse {
  requested: number;
  deleted: number;
  notFound: number;
  results: RemoveContactResult[];
}
