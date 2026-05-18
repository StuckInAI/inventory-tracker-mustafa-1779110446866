import { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useAppData, canEditJob } from '@/hooks/useAppData';

export default function ChecklistsPage() {
  const { checklists, addChecklist, toggleChecklistItem, addChecklistItem, removeChecklist, currentUser } = useAppData();
  const [newTitle, setNewTitle] = useState('');
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});

  const canEdit = canEditJob(currentUser.role);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Checklists</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Track interview prep, offer steps, and onboarding tasks.</p>
        </div>
      </div>

      {canEdit && (
        <Card>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New checklist title..."
              style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '9px 12px', fontSize: 13 }}
            />
            <Button
              icon={<Plus size={15} />}
              disabled={!newTitle.trim()}
              onClick={() => {
                addChecklist(newTitle.trim());
                setNewTitle('');
              }}
            >
              Add
            </Button>
          </div>
        </Card>
      )}

      {checklists.length === 0 ? (
        <Card>
          <EmptyState icon={<CheckSquare size={20} />} title="No checklists yet" description="Create your first checklist to organize hiring tasks." />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {checklists.map((cl) => {
            const done = cl.items.filter((i) => i.done).length;
            return (
              <Card key={cl.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{cl.title}</h3>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{done} / {cl.items.length} complete</div>
                  </div>
                  {canEdit && (
                    <button onClick={() => removeChecklist(cl.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cl.items.map((item) => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, cursor: canEdit ? 'pointer' : 'default' }}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        disabled={!canEdit}
                        onChange={() => toggleChecklistItem(cl.id, item.id)}
                      />
                      <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--color-text-muted)' : 'var(--color-text)' }}>{item.text}</span>
                    </label>
                  ))}
                </div>
                {canEdit && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={newItemText[cl.id] ?? ''}
                      onChange={(e) => setNewItemText({ ...newItemText, [cl.id]: e.target.value })}
                      placeholder="New item..."
                      style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '7px 10px', fontSize: 12 }}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={!(newItemText[cl.id] ?? '').trim()}
                      onClick={() => {
                        addChecklistItem(cl.id, (newItemText[cl.id] ?? '').trim());
                        setNewItemText({ ...newItemText, [cl.id]: '' });
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
