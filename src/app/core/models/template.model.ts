export interface Template {
  _id?: string;
  subject: string;
  html: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplatePayload {
  subject: string;
  html: string;
}
