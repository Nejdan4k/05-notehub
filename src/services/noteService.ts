import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import type { Note, NoteTag } from '../types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;
  if (!token) throw new Error('VITE_NOTEHUB_TOKEN is missing');

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}
export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  items: Note[];
}

/** GET /notes — бекенд повертає { notes, page, perPage, totalPages } */
export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search } = params;
  const q = search && search.trim() ? search.trim() : undefined;

  const { data } = await api.get('/notes', { params: { page, perPage, search: q } });

  return {
    page: data.page ?? 1,
    perPage: data.perPage ?? 12,
    totalPages: data.totalPages ?? 1,
    items: Array.isArray(data.notes) ? data.notes : [],
  };
}

export interface CreateNoteBody { title: string; content: string; tag: NoteTag }
export interface CreateNoteResponse { item: Note }
export async function createNote(body: CreateNoteBody): Promise<CreateNoteResponse> {
  const { data } = await api.post<CreateNoteResponse>('/notes', body);
  return data;
}

export interface DeleteNoteResponse { item: Note }
export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}
