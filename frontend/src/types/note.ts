import type { Task } from "./task";


export interface NoteReference {
  name: string;
  path: string;
}


export interface ResolvedLink {
  target: string;
  path: string;
  name: string;
}


export interface Note {
  name: string;
  path: string;
  content: string;

  tags: string[];

  frontmatter: Record<string, unknown>;

  links: string[];

  resolved_links: ResolvedLink[];

  backlinks: NoteReference[];

  tasks: Task[];
}