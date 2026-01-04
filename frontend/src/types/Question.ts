export type Difficulty = "Easy" | "Medium" | "Hard";
export type Status = "Not Started" | "In Progress" | "Solved";

export interface Question {
  id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  status: Status;
  leetcode_url?: string;
  solution?: string;
  notes?: string;
  date_solved?: string;
}

export interface Stats {
  total: number;
  solved: number;
  in_progress: number;
  not_started: number;
  by_category: { category: string; count: number }[];
  by_difficulty: { difficulty: string; count: number }[];
}
