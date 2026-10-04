import CaseStudy from '../CaseStudy';
import { CASE_STUDIES } from '../case-studies';

const study = CASE_STUDIES.nsti;

export const metadata = {
  title: study.title,
  description: study.description,
};

export default function NstiPage() {
  return <CaseStudy study={study} />;
}
