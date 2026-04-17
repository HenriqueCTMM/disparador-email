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
