'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@scamshield/ui';

export default function ProjectForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, domain })
    });
    if (!response.ok) {
      setError('Unable to create project.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="domain">Primary domain</Label>
        <Input id="domain" value={domain} onChange={(event) => setDomain(event.target.value)} required />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit">Create project</Button>
    </form>
  );
}
