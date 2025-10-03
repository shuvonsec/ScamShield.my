import { describe, expect, it } from 'vitest';
import { library } from '../src';

describe('playbooks', () => {
  it('generates deterministic changes', async () => {
    const playbook = library.find((p) => p.id === 'csp-builder');
    expect(playbook).toBeTruthy();
    const changes = await playbook!.apply({ reportOnly: true });
    expect(changes).toMatchSnapshot();
  });
});
