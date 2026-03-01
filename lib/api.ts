import axios, { AxiosResponse } from "axios";
import type { Note } from "../types/note";
import type { FetchNotesResponse } from "../types/fetchNotesResponse";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers: Record<string, string> = {};
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (error: unknown, attempt: number) => {
  if (axios.isAxiosError(error)) {
    const retryAfter = error.response?.headers?.["retry-after"];
    const retryAfterSeconds = Number(retryAfter);
    if (!Number.isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
      return retryAfterSeconds * 1000;
    }
  }

  return attempt * 1500;
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

// Отримати список нотаток (з пагінацією, пошуком і тегом)
export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  // build params object without undefined values so the backend doesn't
  // receive "search=undefined" or similar, which results in 400.
  const params: { page: number; perPage: number; search?: string; tag?: string } = {
    page,
    perPage,
  };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response: AxiosResponse<FetchNotesResponse> = await instance.get("/notes", {
        params,
      });
      return response.data;
    } catch (error) {
      lastError = error;

      if (axios.isAxiosError(error) && error.response?.status === 429 && attempt < 3) {
        const delay = getRetryDelay(error, attempt);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

// Створити нотатку
export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await instance.post("/notes", note);
  return response.data;
};

// Видалити нотатку
export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await instance.delete(`/notes/${id}`);
  return response.data;
};

// Отримати нотатку за ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    console.log(`Fetching note with ID: ${id}`);
    const response: AxiosResponse<Note> = await instance.get(`/notes/${id}`);
    console.log("Note fetched successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error(`Note with ID ${id} not found.`);
    } else {
      console.error(`Error fetching note ${id}:`, error);
    }
    throw error;
  }
};

