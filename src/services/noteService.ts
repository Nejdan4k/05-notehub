import axios, { AxiosError } from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!token) {
  console.warn("VITE_NOTEHUB_TOKEN is not set!");
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | "";
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  id: string;
}

const noteApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "", tag = "", sortBy = "created" } = params;
  const { data } = await noteApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: search || undefined,
      tag: tag || undefined,
      sortBy
    }
  });
  return data;
}

export async function createNote(dto: CreateNoteDTO): Promise<Note> {
  const { data } = await noteApi.post<Note>("/notes", dto);
  return data;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await noteApi.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}

export function isAxiosError(err: unknown): err is AxiosError {
  return !!(err as AxiosError)?.isAxiosError;
}