import { notFound } from "next/navigation";
import { RESUME_TEMPLATES } from "@/components/resume/templates";
import ResumePreview from "@/components/resume/ResumePreview";

export function generateStaticParams() {
  return RESUME_TEMPLATES.map((template) => ({ template: template.id }));
}

export async function generateMetadata({ params }) {
  const { template } = await params;
  const meta = RESUME_TEMPLATES.find((item) => item.id === template);
  return { title: meta ? `${meta.name} resume` : "Template not found" };
}

export default async function ResumeTemplatePage({ params }) {
  const { template } = await params;
  if (!RESUME_TEMPLATES.some((item) => item.id === template)) notFound();
  return <ResumePreview template={template} />;
}
