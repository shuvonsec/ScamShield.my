import express from 'express';
import { reconDomain } from '@scamshield/recon';
import { getPlaybook } from '@scamshield/playbooks';
import { z } from 'zod';

const app = express();
app.use(express.json());

app.post('/task/recon', async (req, res) => {
  const schema = z.object({ domain: z.string(), projectId: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const result = await reconDomain({ domain: parsed.data.domain });
  res.json({ ok: true, result });
});

app.post('/task/playbook', async (req, res) => {
  const schema = z.object({ playbookId: z.string(), projectId: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const playbook = getPlaybook(parsed.data.playbookId);
  if (!playbook) {
    res.status(404).json({ error: 'Playbook not found' });
    return;
  }
  const changes = playbook.apply({ mode: 'apply', projectId: parsed.data.projectId });
  res.json({ ok: true, changes });
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Worker listening on port ${port}`);
});
