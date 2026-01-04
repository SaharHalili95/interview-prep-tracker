import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from os import getenv

load_dotenv()

MONGODB_URI = getenv("MONGODB_URI", "mongodb://localhost:27017/interview_prep")

leetcode_questions = [
    {
        "title": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "difficulty": "Easy",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/two-sum/"
    },
    {
        "title": "Add Two Numbers",
        "description": "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
        "difficulty": "Medium",
        "category": "Linked List",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/add-two-numbers/"
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Given a string s, find the length of the longest substring without repeating characters.",
        "difficulty": "Medium",
        "category": "String",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
    },
    {
        "title": "Median of Two Sorted Arrays",
        "description": "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
        "difficulty": "Hard",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/median-of-two-sorted-arrays/"
    },
    {
        "title": "Valid Parentheses",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "difficulty": "Easy",
        "category": "Stack",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/valid-parentheses/"
    },
    {
        "title": "Merge Two Sorted Lists",
        "description": "Merge two sorted linked lists and return it as a sorted list.",
        "difficulty": "Easy",
        "category": "Linked List",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/merge-two-sorted-lists/"
    },
    {
        "title": "Maximum Subarray",
        "description": "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
        "difficulty": "Medium",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/maximum-subarray/"
    },
    {
        "title": "Climbing Stairs",
        "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
        "difficulty": "Easy",
        "category": "Dynamic Programming",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/climbing-stairs/"
    },
    {
        "title": "Binary Tree Inorder Traversal",
        "description": "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
        "difficulty": "Easy",
        "category": "Tree",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/binary-tree-inorder-traversal/"
    },
    {
        "title": "Binary Tree Level Order Traversal",
        "description": "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        "difficulty": "Medium",
        "category": "Tree",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"
    },
    {
        "title": "Reverse Linked List",
        "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        "difficulty": "Easy",
        "category": "Linked List",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/reverse-linked-list/"
    },
    {
        "title": "Course Schedule",
        "description": "There are a total of numCourses courses you have to take. Some courses may have prerequisites. Determine if you can finish all courses.",
        "difficulty": "Medium",
        "category": "Graph",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/course-schedule/"
    },
    {
        "title": "Implement Trie (Prefix Tree)",
        "description": "Implement a trie with insert, search, and startsWith methods.",
        "difficulty": "Medium",
        "category": "Trie",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/implement-trie-prefix-tree/"
    },
    {
        "title": "Kth Largest Element in an Array",
        "description": "Given an integer array nums and an integer k, return the kth largest element in the array.",
        "difficulty": "Medium",
        "category": "Heap",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/kth-largest-element-in-an-array/"
    },
    {
        "title": "Word Search",
        "description": "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
        "difficulty": "Medium",
        "category": "Backtracking",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/word-search/"
    },
    {
        "title": "Longest Palindromic Substring",
        "description": "Given a string s, return the longest palindromic substring in s.",
        "difficulty": "Medium",
        "category": "String",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/longest-palindromic-substring/"
    },
    {
        "title": "Product of Array Except Self",
        "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements except nums[i].",
        "difficulty": "Medium",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/product-of-array-except-self/"
    },
    {
        "title": "Trapping Rain Water",
        "description": "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
        "difficulty": "Hard",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/trapping-rain-water/"
    },
    {
        "title": "Best Time to Buy and Sell Stock",
        "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit.",
        "difficulty": "Easy",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
    },
    {
        "title": "Merge Intervals",
        "description": "Given an array of intervals, merge all overlapping intervals.",
        "difficulty": "Medium",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/merge-intervals/"
    },
    {
        "title": "Longest Consecutive Sequence",
        "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
        "difficulty": "Medium",
        "category": "Array",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/longest-consecutive-sequence/"
    },
    {
        "title": "Clone Graph",
        "description": "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
        "difficulty": "Medium",
        "category": "Graph",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/clone-graph/"
    },
    {
        "title": "Validate Binary Search Tree",
        "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        "difficulty": "Medium",
        "category": "Tree",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/validate-binary-search-tree/"
    },
    {
        "title": "Container With Most Water",
        "description": "Given n non-negative integers representing heights, find two lines that together with the x-axis form a container with the most water.",
        "difficulty": "Medium",
        "category": "Two Pointers",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/container-with-most-water/"
    },
    {
        "title": "Letter Combinations of a Phone Number",
        "description": "Given a string containing digits from 2-9, return all possible letter combinations that the number could represent.",
        "difficulty": "Medium",
        "category": "Backtracking",
        "status": "Not Started",
        "leetcode_url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"
    }
]


async def seed_database():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.interview_prep
    questions_collection = db.questions

    existing_count = await questions_collection.count_documents({})
    if existing_count > 0:
        print(f"Database already has {existing_count} questions. Clearing...")
        await questions_collection.delete_many({})

    result = await questions_collection.insert_many(leetcode_questions)
    print(f"Successfully added {len(result.inserted_ids)} LeetCode questions to the database!")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
