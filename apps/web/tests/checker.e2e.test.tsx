import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckPage from '../app/(public)/check/page';

vi.spyOn(global, 'fetch').mockImplementation(async () =>
  new Response(
    JSON.stringify({
      score: 65,
      verdict: 'suspicious',
      reasons: ['Mock reason'],
      signals: ['Mock signal'],
      reportId: 'share-1',
      rationale: ['Mock rationale']
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
);

describe('CheckPage integration', () => {
  it('submits and renders verdict', async () => {
    render(<CheckPage />);
    const input = screen.getByLabelText(/suspicious link/i);
    fireEvent.change(input, { target: { value: 'https://malicious.test' } });

    fireEvent.click(screen.getByText(/check now/i));

    await waitFor(() => {
      expect(screen.getByText(/verdict/i)).toBeInTheDocument();
      expect(screen.getByText(/suspicious/i)).toBeInTheDocument();
    });
  });
});
