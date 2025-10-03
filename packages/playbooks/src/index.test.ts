import { describe, expect, it } from 'vitest';
import { getPlaybook, getPlaybooks } from './index';

describe('playbooks', () => {
  it('returns playbooks', () => {
    const list = getPlaybooks();
    expect(list.length).toBeGreaterThan(0);
  });

  it('generates deterministic changes', () => {
    const playbook = getPlaybook('csp-builder');
    expect(playbook).toBeTruthy();
    const changes = playbook?.apply({ mode: 'preview' }) ?? [];
    expect(changes).toMatchSnapshot();
  });
});
