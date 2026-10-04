import CaseStudy from '../CaseStudy';
import { CASE_STUDIES } from '../case-studies';

// Only the studies in case-studies.js exist; anything else under /work/ is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = CASE_STUDIES[slug];
  return { title: study.title, description: study.description };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  return <CaseStudy key={slug} study={CASE_STUDIES[slug]} />;
}
