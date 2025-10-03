import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '@scamshield/ui';

export type ProjectWithScan = {
  id: string;
  name: string;
  domain: string;
  status: string;
  lastScan?: string | null;
};

export function ProjectsTable({ projects }: { projects: ProjectWithScan[] }) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="flex flex-wrap items-center justify-between gap-4">
        <CardTitle>Projects</CardTitle>
        <Button asChild>
          <Link href="/projects/new">Add project</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last scan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <Link href={`https://${project.domain}`} className="text-safe underline">
                    {project.domain}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === 'healthy' ? 'default' : 'destructive'}>{project.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-300">{project.lastScan ?? 'Never'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
