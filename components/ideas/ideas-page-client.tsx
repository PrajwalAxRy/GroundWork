'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  Button,
  ConfirmDialog,
  Feedback,
  IconButton,
  Menu,
  TextAreaField,
  TextField,
} from '@/components/ui/product-primitives';
import type { Idea, Stage, StageState } from '@/lib/contracts/product';
import { mockProductService } from '@/lib/services/product-service';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  LoaderCircle,
  LockKeyhole,
  MoreHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';

type Preview = 'populated' | 'empty' | 'loading' | 'error';

const actionPriority: StageState[] = [
  'unread',
  'running',
  'failed',
  'ready',
  'active',
  'available',
];

function primaryStage(idea: Idea): Stage {
  const stage = actionPriority
    .map((state) => idea.stages.find((entry) => entry.state === state))
    .find((entry): entry is Stage => Boolean(entry));
  const fallback = idea.stages.at(-1);
  if (stage) return stage;
  if (fallback) return fallback;
  throw new Error(`Idea ${idea.id} has no stages.`);
}

function StageIcon({ state }: { state: StageState }) {
  if (state === 'locked') return <LockKeyhole aria-hidden="true" />;
  if (state === 'complete') return <Check aria-hidden="true" />;
  if (state === 'running') return <LoaderCircle className="spinner" aria-hidden="true" />;
  if (state === 'failed') return <AlertTriangle aria-hidden="true" />;
  return <ArrowRight aria-hidden="true" />;
}

function StageMarker({ stage, index }: { stage: Stage; index: number }) {
  if (['locked', 'complete', 'running', 'failed'].includes(stage.state))
    return <StageIcon state={stage.state} />;
  return <>{index + 1}</>;
}

export function IdeasPageClient({ initialPreview = 'populated' }: { initialPreview?: Preview }) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [preview, setPreview] = useState<Preview>(initialPreview);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Idea | null>(null);
  const [feedback, setFeedback] = useState('');
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPreview === 'loading') return;
    if (initialPreview === 'error') {
      setPreview('error');
      return;
    }
    void mockProductService.listIdeas().then((loaded) => {
      setIdeas(loaded);
      setPreview(initialPreview === 'empty' ? 'empty' : 'populated');
    });
  }, [initialPreview]);

  async function retryLoad() {
    setIdeas(await mockProductService.listIdeas());
    setPreview('populated');
  }

  useEffect(() => {
    if (composerOpen) composerRef.current?.focus();
  }, [composerOpen]);

  function openStage(idea: Idea, stage: Stage) {
    if (stage.state === 'locked') return;
    if (stage.key === 'shape') {
      router.push(`/ideas/${idea.id}/shape`);
      return;
    }
    setFeedback(`${stage.action} will connect when its page is built in the next prototype phase.`);
  }

  async function createIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const thought = String(form.get('idea') ?? '').trim();
    if (!thought) return;
    const idea = await mockProductService.createIdea(thought);
    router.push(`/ideas/${idea.id}/shape`);
  }

  async function renameIdea(event: FormEvent<HTMLFormElement>, ideaId: string) {
    event.preventDefault();
    const title = String(new FormData(event.currentTarget).get('title') ?? '').trim();
    if (!title) return;
    await mockProductService.renameIdea(ideaId, title);
    setIdeas(await mockProductService.listIdeas());
    setEditing(null);
    setFeedback('Dashboard title renamed.');
  }

  async function deleteIdea() {
    if (!deleting) return;
    await mockProductService.deleteIdea(deleting.id);
    setIdeas(await mockProductService.listIdeas());
    setDeleting(null);
    setFeedback('Idea removed from this prototype.');
  }

  function Composer() {
    return (
      <section className="composer" aria-labelledby="composer-title">
        <div>
          <h2 id="composer-title">What are you thinking about building?</h2>
          <p>A sentence or a rough problem is enough to begin.</p>
        </div>
        <form onSubmit={createIdea}>
          <TextAreaField
            ref={composerRef}
            label="Your initial idea"
            visuallyHiddenLabel
            name="idea"
            rows={3}
            placeholder="I keep noticing that…"
            required
          />
          <div className="composer__actions">
            {ideas.length > 0 && (
              <Button variant="text" type="button" onClick={() => setComposerOpen(false)}>
                Cancel
              </Button>
            )}
            <Button type="submit">Start shaping</Button>
          </div>
        </form>
        <div className="idea-starters" aria-label="Idea starters">
          <span>Try a starting point:</span>
          {[
            'A simple way for independent cafés to reduce food waste at the end of each day.',
            'A lightweight service that helps landlords manage recurring repairs.',
          ].map((starter) => (
            <button
              type="button"
              key={starter}
              onClick={() => {
                if (composerRef.current) {
                  composerRef.current.value = starter;
                  composerRef.current.focus();
                }
              }}
            >
              {starter.includes('cafés') ? 'Independent cafés' : 'Landlords'}
            </button>
          ))}
        </div>
      </section>
    );
  }

  function IdeaCard({ idea }: { idea: Idea }) {
    const focus = primaryStage(idea);
    const isEditing = editing === idea.id;
    return (
      <article className={`idea-card idea-card--${focus.state}`}>
        <div className="idea-card__signal" aria-hidden="true" />
        <div className="idea-card__body">
          <p className="notice">
            <span aria-hidden="true" />
            {idea.notice ??
              (focus.state === 'active' ? 'Shape in progress' : focus.note || focus.action)}
          </p>
          {isEditing ? (
            <form className="rename-form" onSubmit={(event) => void renameIdea(event, idea.id)}>
              <TextField
                label="Idea title"
                name="title"
                defaultValue={idea.title}
                required
                autoFocus
              />
              <div>
                <Button variant="text" type="button" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button className="small-primary" type="submit">
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <h2>{idea.title}</h2>
          )}
          <p className="brief">{idea.brief}</p>
        </div>
        <div className="idea-card__history" aria-label={`Other stages for ${idea.title}`}>
          {idea.stages
            .filter((stage) => stage !== focus)
            .map((stage) => (
              <button
                type="button"
                key={stage.key}
                className={`card-stage card-stage--${stage.state}`}
                disabled={stage.state === 'locked'}
                onClick={() => openStage(idea, stage)}
                aria-label={`${stage.action}: ${stage.label} for ${idea.title}`}
              >
                <span className="card-stage__marker" aria-hidden="true">
                  <StageMarker stage={stage} index={idea.stages.indexOf(stage)} />
                </span>
                <span>
                  <strong>{stage.label}</strong>
                  <small>{stage.action}</small>
                </span>
              </button>
            ))}
        </div>
        <button
          type="button"
          className={`idea-card__focus idea-card__focus--${focus.state}`}
          onClick={() => openStage(idea, focus)}
          aria-label={`${focus.action}: ${focus.label} for ${idea.title}`}
        >
          <span>{focus.note || focus.label}</span>
          <strong>{focus.action}</strong>
          <StageIcon state={focus.state} />
        </button>
        <div className="card-menu-wrap">
          <Menu
            trigger={
              <IconButton label={`More actions for ${idea.title}`}>
                <MoreHorizontal aria-hidden="true" />
              </IconButton>
            }
          >
            <button type="button" onClick={() => setEditing(idea.id)}>
              Rename
            </button>
            <button type="button" className="danger" onClick={() => setDeleting(idea)}>
              Delete idea
            </button>
          </Menu>
        </div>
      </article>
    );
  }

  return (
    <ProductShell>
      <main className="ideas-page">
        <section className="page-heading">
          <div>
            <p className="kicker">Your working set</p>
            <h1>Your ideas</h1>
            <p className="intro">
              Pick up where you left off, or give a new thought room to become specific.
            </p>
          </div>
          <Button
            onClick={() => {
              setPreview('populated');
              setComposerOpen(true);
            }}
          >
            New idea <span aria-hidden="true">＋</span>
          </Button>
        </section>
        {(composerOpen || preview === 'empty') && <Composer />}
        {feedback && (
          <Feedback tone="info" title="Prototype route">
            {feedback}
          </Feedback>
        )}
        {preview === 'loading' && (
          <section className="loading-stack" aria-label="Loading ideas" aria-busy="true">
            {[1, 2, 3].map((item) => (
              <div className="skeleton-card" key={item}>
                <i />
                <b />
                <span />
                <footer />
              </div>
            ))}
          </section>
        )}
        {preview === 'error' && (
          <Feedback
            title="Your ideas could not load."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setPreview('populated');
                  void retryLoad();
                }}
              >
                Try again
              </Button>
            }
          >
            Your saved ideas have not changed. Try loading them again.
          </Feedback>
        )}
        {preview === 'empty' && (
          <section className="empty-state">
            <span className="empty-symbol" aria-hidden="true">
              +
            </span>
            <h2>Your ideas start as rough notes.</h2>
            <p>
              Bring a customer problem, a small irritation, or the beginning of a solution.
              Groundwork will help you make it researchable.
            </p>
          </section>
        )}
        {preview === 'populated' && (
          <>
            <div className="list-heading">
              <p>{ideas.length} ideas</p>
              <span>Most recently updated</span>
            </div>
            <section className="idea-list" aria-label="Your ideas">
              {ideas.map((idea) => (
                <IdeaCard idea={idea} key={idea.id} />
              ))}
            </section>
          </>
        )}
      </main>
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete this idea?"
        description="This removes its Shape conversation, investigation report, and roadmap from this prototype."
        confirmLabel="Delete idea"
        onConfirm={() => void deleteIdea()}
      />
    </ProductShell>
  );
}
