export interface EnqueueMessagePayload {
  templateId: string;
  tags: string[];
}

export interface MessageResponse {
  message: string;
}
