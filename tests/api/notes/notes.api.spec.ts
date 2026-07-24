import { test, expect } from '@playwright/test';
import { AuthRequest, LoginPayload } from '../../../requests/AuthRequest';
import { NotesRequest } from '../../../requests/NotesRequest';
//import { validLoginPayload } from '../../payloads/login/validLoginPayload';

test.describe('API de Notas', () => {
  let auth: AuthRequest;
  let notes: NotesRequest;
  let authToken: string;
  let createdNoteId: string;

  test.beforeAll(async ({ request }) => {
    auth = new AuthRequest(request);
    const loginPayload: LoginPayload = {
      email: process.env.NOTES_EMAIL!,
      password: process.env.NOTES_PASSWORD!,
    };
    const loginResponse = await auth.login(loginPayload);
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.data.token;
  });

  test.beforeEach(({ request }) => {
    notes = new NotesRequest(request);
  });

  test.afterEach(async () => {
    console.log('Aguardando 3 segundos após o teste...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  test('deve criar uma nova nota', async () => {
    const title = 'Minha Nova Nota';
    const description = 'Esta é a descrição da minha nova nota.';
    const category = 'Work';

    const response = await notes.createNote(authToken, title, description, category);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Note successfully created');
    expect(body.data).toBeDefined();
    expect(body.data.title).toBe(title);
    expect(body.data.description).toBe(description);
    expect(body.data.category).toBe(category);
    expect(typeof body.data.id).toBe('string');
    createdNoteId = body.data.id;
  });

  test('deve obter todas as notas', async () => {
    const response = await notes.getNotes(authToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.some((note: any) => note.id === createdNoteId)).toBeTruthy();
  });

  test('deve obter uma única nota por ID', async () => {
    // Garante que uma nota seja criada antes de tentar recuperá-la por ID
    if (!createdNoteId) {
      const createResponse = await notes.createNote(authToken, 'Nota para obtenção por ID', 'Descrição da nota para obtenção por ID', 'Pessoal');
      const createBody = await createResponse.json();
      createdNoteId = createBody.data.id;
    }

    const response = await notes.getNoteById(authToken, createdNoteId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(createdNoteId);
  });

  test('deve atualizar uma nota existente', async () => {
    // Garante que uma nota seja criada antes de tentar atualizá-la
if (!createdNoteId) {
    const createResponse = await notes.createNote(authToken, 'Nota original para atualização', 'Descrição original da nota para atualização', 'Home');    
    const createBody = await createResponse.json();        
    createdNoteId = createBody.data.id;
}

    const updatedTitle = 'Título Atualizado';
    const updatedDescription = 'Descrição Atualizada da Nota';
    const updatedCategory = 'Home';
    const updatedCompleted = false; 
    const response = await notes.updateNote(authToken, createdNoteId, updatedTitle, updatedDescription, updatedCategory, updatedCompleted);
    const errorBody = await response.json();
    expect(response.status()).toBe(200);


    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Note successfully Updated');
    expect(body.data).toBeDefined();
    expect(body.data.title).toBe(updatedTitle);
    expect(body.data.description).toBe(updatedDescription);
    expect(body.data.category).toBe(updatedCategory);
  });

  test('deve excluir uma nota', async () => {
    // Garante que uma nota seja criada antes de tentar excluí-la
    if (!createdNoteId) {
      const createResponse = await notes.createNote(authToken, 'Nota a ser excluída', 'Descrição da nota a ser excluída', 'Compras');
      const createBody = await createResponse.json();
      createdNoteId = createBody.data.id;
    }

    const response = await notes.deleteNote(authToken, createdNoteId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Note successfully deleted');

    // Verifica se a nota não existe mais
    const getResponse = await notes.getNoteById(authToken, createdNoteId);
    expect(getResponse.status()).toBe(404);
  });

});

test.describe('API Health Check', () => {
  test('deve retornar status 200 e mensagem de sucesso para health check', async ({ request }) => {
    const response = await request.get('https://practice.expandtesting.com/notes/api/healthcheck');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Health Check');
  });
});
