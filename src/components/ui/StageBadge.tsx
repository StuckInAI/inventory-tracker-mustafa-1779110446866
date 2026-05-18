import Badge from './Badge';
import { stageLabel } from '@/lib/format';
import type { PipelineStage } from '@/types';

const toneMap: Record<PipelineStage, 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  Applied: 'neutral',
  Referral: 'info',
  Screened: 'info',
  Interview: 'primary',
  Offer: 'warning',
  Hired: 'success',
  Rejected: 'danger',
  Onboarding: 'success',
  BackgroundCheck: 'warning',
};

export default function StageBadge({ stage }: { stage: PipelineStage }) {
  return <Badge tone={toneMap[stage]}>{stageLabel(stage)}</Badge>;
}
