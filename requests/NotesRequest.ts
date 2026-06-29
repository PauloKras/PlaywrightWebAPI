import { APIRequestContext } from '@playwright/test';

export class NotesRequest {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createNote(token: string, title: string, description: string, category: string) {
    return await this.request.post(
      `${process.env.BASE_URL_API}/notes`,
      {
        headers: {
            'x-auth-token': token, 
            // A API do ExpandTesting exige este formato
        },
        data: {
          title,
          description,
          category,
        },
      },
    );
  }

  async getNotes(token: string) {
    return await this.request.get(
      `${process.env.BASE_URL_API}/notes`,
      {
       headers: {
            'x-auth-token': token, // A API do ExpandTesting exige este formato
        },
      },
    );
  }

  async getNoteById(token: string, noteId: string) {
    return await this.request.get(
      `${process.env.BASE_URL_API}/notes/${noteId}`,
      {
        headers: {
            'x-auth-token': token, // A API do ExpandTesting exige este formato
        },
      },
    );
  }

  async updateNote(token: string, noteId: string, title: string, description: string, category: string, completed: boolean) {
    return await this.request.put(
      `${process.env.BASE_URL_API}/notes/${noteId}`,
      {
        headers: {
            'x-auth-token': token, // A API do ExpandTesting exige este formato
        },
        data: {
          title,
          description,
          category,
          completed,
        },
      },
    );
  }

  async deleteNote(token: string, noteId: string) {
    return await this.request.delete(
      `${process.env.BASE_URL_API}/notes/${noteId}`,
      {
        headers: {
            'x-auth-token': token, // A API do ExpandTesting exige este formato
        },
      },
    );
  }
}
