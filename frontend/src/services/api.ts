import { Question, Stats } from "../types/Question";

const STORAGE_KEY = "interview-prep-questions";

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

// Get questions from localStorage
const getStoredQuestions = (): Question[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Return sample data on first load
  const sampleData: Question[] = [
    {
      id: generateId(),
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      category: "Array",
      status: "Solved",
      leetcode_url: "https://leetcode.com/problems/two-sum/",
      solution: "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
      notes: "Classic hash map problem. O(n) time, O(n) space.",
    },
    {
      id: generateId(),
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      category: "Stack",
      status: "Solved",
      leetcode_url: "https://leetcode.com/problems/valid-parentheses/",
      notes: "Use a stack to match opening and closing brackets.",
    },
    {
      id: generateId(),
      title: "Merge Two Sorted Lists",
      description: "Merge two sorted linked lists and return it as a sorted list.",
      difficulty: "Easy",
      category: "Linked List",
      status: "In Progress",
      leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    },
    {
      id: generateId(),
      title: "Maximum Subarray",
      description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      difficulty: "Medium",
      category: "Dynamic Programming",
      status: "Not Started",
      leetcode_url: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: generateId(),
      title: "Binary Tree Level Order Traversal",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      difficulty: "Medium",
      category: "Tree",
      status: "Not Started",
      leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
  return sampleData;
};

// Save questions to localStorage
const saveQuestions = (questions: Question[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

// Calculate stats from questions
const calculateStats = (questions: Question[]): Stats => {
  const stats: Stats = {
    total: questions.length,
    solved: 0,
    in_progress: 0,
    not_started: 0,
    by_category: [],
    by_difficulty: [],
  };

  const categoryCount: { [key: string]: number } = {};
  const difficultyCount: { [key: string]: number } = {};

  questions.forEach((q) => {
    // Count by status
    if (q.status === "Solved") stats.solved++;
    else if (q.status === "In Progress") stats.in_progress++;
    else stats.not_started++;

    // Count by category
    categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;

    // Count by difficulty
    difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1;
  });

  stats.by_category = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count,
  }));

  stats.by_difficulty = Object.entries(difficultyCount).map(
    ([difficulty, count]) => ({
      difficulty,
      count,
    })
  );

  return stats;
};

export const api = {
  getQuestions: async (): Promise<Question[]> => {
    return Promise.resolve(getStoredQuestions());
  },

  createQuestion: async (question: Question): Promise<Question> => {
    const questions = getStoredQuestions();
    const newQuestion = { ...question, id: generateId() };
    questions.push(newQuestion);
    saveQuestions(questions);
    return Promise.resolve(newQuestion);
  },

  updateQuestion: async (
    id: string,
    question: Partial<Question>
  ): Promise<Question> => {
    const questions = getStoredQuestions();
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...question };
      saveQuestions(questions);
      return Promise.resolve(questions[index]);
    }
    return Promise.reject(new Error("Question not found"));
  },

  deleteQuestion: async (id: string): Promise<void> => {
    const questions = getStoredQuestions();
    const filtered = questions.filter((q) => q.id !== id);
    saveQuestions(filtered);
    return Promise.resolve();
  },

  getStats: async (): Promise<Stats> => {
    const questions = getStoredQuestions();
    return Promise.resolve(calculateStats(questions));
  },
};
