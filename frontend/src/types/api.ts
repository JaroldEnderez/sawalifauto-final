// types/api.ts
import { Article } from "./types";

export type ArticlesResponse = {
  success: boolean;
  articles: Article[];
};
