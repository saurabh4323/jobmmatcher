export const PRACTICE_MODES = [
  { id: "code", label: "Coding" },
  { id: "theory", label: "System & theory" },
  { id: "behavioral", label: "Behavioral" },
];

export const LANGUAGES = [
  { id: "python3", label: "Python", starter: "def solve():\n    # Write your solution here\n    pass\n\n\nprint(solve())\n" },
  { id: "nodejs", label: "JavaScript", starter: "function solve() {\n  // Write your solution here\n}\n\nconsole.log(solve());\n" },
  { id: "java", label: "Java", starter: "public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println(\"Hello\");\n    }\n}\n" },
  { id: "cpp17", label: "C++", starter: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << \"Hello\" << endl;\n    return 0;\n}\n" },
];

export const QUESTIONS = {
  code: [
    {
      question: "Write a function that returns true if a string is a valid email address (username@domain.extension) and false otherwise.",
      difficulty: "easy",
      time: 300,
      examples: ["\"test@example.com\" → true", "\"invalid-email\" → false"],
      hints: ["A regular expression keeps this short.", "Check for exactly one @ and a dot in the domain."],
    },
    {
      question: "Given an array and a target, return every pair of numbers that sums to the target. For [1, 4, 6, 8, 9, 2] and 10, return [[1,9],[4,6],[8,2]].",
      difficulty: "medium",
      time: 420,
      examples: ["[1,4,6,8,9,2], 10 → [[1,9],[4,6],[8,2]]"],
      hints: ["A hash set gives O(n) time.", "Think about duplicate values."],
    },
    {
      question: "Determine whether a binary tree is height-balanced: for every node, the heights of its two subtrees differ by at most one.",
      difficulty: "medium",
      time: 480,
      hints: ["Recurse and return height, or -1 when unbalanced.", "Avoid recomputing heights — aim for O(n)."],
    },
    {
      question: "Implement an LRU cache with a fixed capacity supporting get(key) and put(key, value) in O(1) time.",
      difficulty: "hard",
      time: 600,
      hints: ["Combine a hash map with a doubly linked list.", "Move a node to the front on every access."],
    },
    {
      question: "Given a directed graph of processes waiting on resources, detect whether a deadlock (cycle) exists and return the processes involved.",
      difficulty: "hard",
      time: 600,
      hints: ["Model it as a wait-for graph.", "DFS with a recursion stack detects cycles."],
    },
  ],
  theory: [
    { question: "Compare REST and GraphQL APIs. When would you choose each, and what are the trade-offs?", difficulty: "medium", time: 300, hints: ["Over- and under-fetching", "Caching", "Schema and tooling"] },
    { question: "Explain horizontal vs. vertical scaling. When would you choose one over the other?", difficulty: "medium", time: 300, hints: ["Load balancing", "Sharding and replication", "Cost and failure modes"] },
    { question: "Explain the CAP theorem and how it shapes distributed database design.", difficulty: "hard", time: 360, hints: ["Partition tolerance is not optional", "CP vs AP examples", "Eventual consistency"] },
    { question: "Walk through what happens from typing a URL into a browser to the page rendering.", difficulty: "medium", time: 360, hints: ["DNS", "TCP/TLS handshake", "HTTP, parsing, rendering"] },
  ],
  behavioral: [
    { question: "Describe a challenging project and how you overcame the obstacles to deliver it.", difficulty: "medium", time: 300, hints: ["Use STAR: Situation, Task, Action, Result", "Quantify the result"] },
    { question: "Tell me about a time you made a technical decision with incomplete information.", difficulty: "medium", time: 300, hints: ["How you assessed risk", "How you communicated it", "What you learned"] },
    { question: "Describe a disagreement with a teammate and how you resolved it.", difficulty: "medium", time: 300, hints: ["Focus on listening", "Show the outcome for the team"] },
  ],
};
