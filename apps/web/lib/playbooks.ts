import { library } from '@scamshield/playbooks';

export function getPlaybookSummaries() {
  return library.map((playbook) => ({
    id: playbook.id,
    name: playbook.name,
    description: playbook.description,
    risks: playbook.risks
  }));
}
