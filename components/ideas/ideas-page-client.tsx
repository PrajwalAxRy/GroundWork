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
import type { Idea, Stage } from '@/lib/contracts/product';
import { mockProductService } from '@/lib/services/product-service';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

type Preview = 'populated' | 'empty' | 'loading' | 'error';

type DashboardAction = {
  label: 'Continue shaping' | 'Review idea' | 'View roadmap';
  stage: Stage;
};

function dashboardAction(idea: Idea): DashboardAction {
  const shape = idea.stages.find((stage) => stage.key === 'shape');
  const roadmap = idea.stages.find((stage) => stage.key === 'roadmap');

  if (!shape || !roadmap) throw new Error(`Idea ${idea.id} is missing a dashboard stage.`);
  if (shape.state === 'active') return { label: 'Continue shaping', stage: shape };
  if (roadmap.state === 'complete') return { label: 'View roadmap', stage: roadmap };
  return { label: 'Review idea', stage: shape };
}

export function IdeasPageClient({ initialPreview = 'populated' }: { initialPreview?: Preview }) {
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
      setFeedback(
        `Shape for “${idea.title}” is unavailable while that page is rebuilt from scratch.`,
      );
      return;
    }
    setFeedback(`${stage.action} will connect when its page is built in the next prototype phase.`);
  }

  async function createIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const thought = String(form.get('idea') ?? '').trim();
    if (!thought) return;
    await mockProductService.createIdea(thought);
    setIdeas(await mockProductService.listIdeas());
    setPreview('populated');
    setComposerOpen(false);
    setFeedback('Idea saved. Shape will be available after its page is rebuilt.');
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
    const action = dashboardAction(idea);
    const isEditing = editing === idea.id;
    return (
      <article className="idea-card">
        <div className="idea-card__signal" aria-hidden="true" />
        <div className="idea-card__body">
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
        <button
          type="button"
          className="idea-card__focus"
          onClick={() => openStage(idea, action.stage)}
          aria-label={`${action.label} for ${idea.title}`}
        >
          <strong>{action.label}</strong>
          <ArrowRight aria-hidden="true" />
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
