import { useState } from 'react';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useAppData, canEdit } from '@/hooks/useAppData';
import { CheckSquare } from 'lucide-react';

export default function ChecklistsPage() {
  const { checklistTemplates, candidates, currentUser, toggleChecklistItem } = useAppData();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id ?? '');

  const editable = canEdit(currentUser.role);
  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  if (checklistTemplates.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<CheckSquare size={22} />}
          title="No checklists yet"
          description="Checklist templates help standardize the hiring process across roles."
        />
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Checklists</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          Track standardized hiring tasks for each candidate.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Select candidate"
          subtitle="Choose a candidate to view and update their checklist progress."
        />
        <select
          value={selectedCandidateId}
          onChange={(e) => setSelectedCandidateId(e.target.value)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 13,
            width: '100%',
            maxWidth: 360,
          }}
        >
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.stage}
            </option>
          ))}
        </select>
      </Card>

      {selectedCandidate &&
        checklistTemplates.map((cl) => {
          const completed = selectedCandidate.checklistProgress?.[cl.id] ?? [];
          return (
            <Card key={cl.id}>
              <CardHeader
                title={cl.name}
                subtitle={cl.description}
                action={cl.appliesToStage ? <Badge tone="info">{cl.appliesToStage}</Badge> : undefined}
              />
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cl.items.map((item) => {
                  const isDone = completed.includes(item.id);
                  return (
                    <li
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: isDone ? 'var(--color-success-soft)' : 'var(--color-surface-2)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        disabled={!editable}
                        onChange={() => toggleChecklistItem(selectedCandidate.id, cl.id, item.id)}
                      />
                      <span style={{ fontSize: 13, textDecoration: isDone ? 'line-through' : 'none' }}>
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {!editable && (
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  You don't have permission to update checklist items.
                </div>
              )}
            </Card>
          );
        })}

      {!selectedCandidate && (
        <Card>
          <EmptyState title="No candidate selected" description="Pick a candidate above to see their checklist progress." />
        </Card>
      )}
      <div style={{ display: 'none' }}><Button>placeholder</Button></div>
    </div>
  );
}
