import { notFound } from "next/navigation";
import { TOPICS, topicBySlug } from "@/lib/topics";
import MockInterview from "@/components/interview/MockInterview";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }) {
  const topic = topicBySlug((await params).topic);
  return { title: topic ? `${topic.name} mock interview` : "Topic not found" };
}

export default async function MockInterviewPage({ params }) {
  const topic = topicBySlug((await params).topic);
  if (!topic) notFound();
  return <MockInterview topic={topic} />;
}
