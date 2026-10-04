import CaseStudy from '../CaseStudy';
import { CASE_STUDIES } from '../case-studies';

const study = CASE_STUDIES.omnipod;

export const metadata = {
  title: study.title,
  description: study.description,
};

export default function OmnipodPage() {
  return <CaseStudy study={study} />;
}
