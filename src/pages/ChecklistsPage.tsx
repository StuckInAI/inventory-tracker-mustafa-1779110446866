import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function ChecklistsPage() {
  const { checklists, candidates, toggleChecklistItemForCandidate } = useAppData();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id ?? '');

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Checklists</h1>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
          Standardize your hiring process with reusable checklists.
        </div>
      </div>

      {checklists.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardList size={20} />}
            title="No checklists yet"
            description="Create templates to standardize your hiring process."
          />
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader title="Track progress for a candidate" subtitle="Pick a candidate to see and update their checklist status" />
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                background: 'var(--color-surface)',
              }}
            >
              <option value="">Select a candidate...</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — {c.stage}
                </option>
              ))}
            </select>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {checklists.map((cl) => {
              const progress = selectedCandidate?.checklistProgress?.[cl.id];
              const completed: string[] = Array.isArray(progress) ? progress : [];
              const total = cl.items.length;
              const doneCount = completed.length;
              return (
                <Card key={cl.id}>
                  <CardHeader
                    title={cl.name}
                    subtitle={cl.description}
                    action={cl.appliesToStage ? <Badge tone="info">{cl.appliesToStage}</Badge> : undefined}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cl.items.map((item) => {
                      const isDone = completed.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            background: isDone ? 'var(--color-success-soft)' : 'var(--color-surface-2)',
                            borderRadius: 'var(--radius-md)',
                            cursor: selectedCandidate ? 'pointer' : 'not-allowed',
                            opacity: selectedCandidate ? 1 : 0.6,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            disabled={!selectedCandidate}
                            onChange={() => selectedCandidate && toggleChecklistItemForCandidate(selectedCandidate.id, cl.id, item.id)}
                          />
                          <span style={{ fontSize: 13, flex: 1, textDecoration: isDone ? 'line-through' : 'none' }}>
                            {item.label}
                          </span>
                          {item.required && <Badge tone="warning">Required</Badge>}
                        </label>
                      );
                    })}
                  </div>
                  {selectedCandidate && (
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {doneCount} of {total} complete
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
