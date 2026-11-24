// Interview topics with curated learning resources. `slug` is used in URLs.
export const TOPIC_CATEGORIES = ["Data structures", "Languages", "Frameworks"];

export const TOPICS = [
  { slug: "arrays-strings", name: "Arrays and Strings", category: "Data structures", video: "B2KusJcbVIg", docs: "https://www.geeksforgeeks.org/array-data-structure/" },
  { slug: "linked-lists", name: "Linked Lists", category: "Data structures", video: "Hj_rA0dhr2I", docs: "https://www.w3schools.com/dsa/dsa_theory_linkedlists.php" },
  { slug: "stacks-queues", name: "Stacks and Queues", category: "Data structures", video: "wjI1WNcIntg", docs: "https://www.w3schools.com/dsa/dsa_data_stacks.php" },
  { slug: "bit-manipulation", name: "Bit Manipulation", category: "Data structures", video: "NLKQEOgBAnw", docs: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/" },
  { slug: "heaps", name: "Heaps and Priority Queues", category: "Data structures", video: "HqPJF2L5h9U", docs: "https://www.geeksforgeeks.org/heap-data-structure/" },
  { slug: "segment-trees", name: "Segment Trees", category: "Data structures", video: "ZBHKZF5w4YU", docs: "https://www.geeksforgeeks.org/segment-tree-data-structure/" },
  { slug: "javascript", name: "JavaScript", category: "Languages", video: "jS4aFq5-91M", docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
  { slug: "typescript", name: "TypeScript", category: "Languages", video: "BCg4U1FzODs", docs: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { slug: "python", name: "Python", category: "Languages", video: "rfscVS0vtbw", docs: "https://docs.python.org/3/tutorial/" },
  { slug: "cpp", name: "C++", category: "Languages", video: "vLnPwxZdW4Y", docs: "https://www.learncpp.com/" },
  { slug: "java", name: "Java", category: "Languages", video: "eIrMbAQSU34", docs: "https://dev.java/learn/" },
  { slug: "go", name: "Go", category: "Languages", video: "YS4e4q9oBaU", docs: "https://go.dev/tour/" },
  { slug: "rust", name: "Rust", category: "Languages", video: "5C_HPTJg5ek", docs: "https://doc.rust-lang.org/book/" },
  { slug: "php", name: "PHP", category: "Languages", video: "OK_JCtrrv-c", docs: "https://www.php.net/manual/en/getting-started.php" },
  { slug: "csharp", name: "C#", category: "Languages", video: "GhQdlIFylQ8", docs: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
  { slug: "react", name: "React", category: "Frameworks", video: "t_ispmWmdjY", docs: "https://react.dev/learn" },
];

export const topicBySlug = (slug) => TOPICS.find((topic) => topic.slug === decodeURIComponent(slug || ""));

const norm = (value) => value.toLowerCase().replace(/[^a-z0-9+#]/g, "");
/** Topics that relate to any of the given skills. */
export function topicsForSkills(skills = []) {
  const mine = skills.map(norm);
  return TOPICS.filter((topic) => {
    const keys = [norm(topic.name), topic.slug.replace(/-/g, "")];
    return mine.some((skill) => keys.some((key) => skill === key || (skill.length > 1 && key.startsWith(skill)) || (key.length > 1 && skill.startsWith(key))));
  });
}
