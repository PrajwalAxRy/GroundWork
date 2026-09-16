'use client';

import { ProductShell } from '@/components/product/product-shell';
import type { IdeaBrief } from '@/lib/contracts/product';
import {
  type BriefReviewField,
  type ConfirmScenarioKey,
  confirmIdeaScenarios,
} from '@/lib/fixtures/confirm-idea';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  FileSearch,
  Lightbulb,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useMemo, useState } from 'react';

type BriefStatus = IdeaBrief['fields'][number]['status'];

const statusOptions: Array<{
  value: BriefStatus;
  label: string;
  shortLabel: string;
}> = [
  { value: 'confirmed', label: 'Confirmed by me', shortLabel: 'Confirmed' },
  { value: 'assumption', label: "Groundwork's assumption", shortLabel: 'Assumption' },
  { value: 'investigate', label: 'Investigate this for me', shortLabel: 'Investigate' },
];

function StatusIcon({ status }: { status: BriefStatus }) {
  if (status === 'confirmed') return <Check aria-hidden="true" />;
  if (status === 'assumption') return <Lightbulb aria-hidden="true" />;
  return <Search aria-hidden="true" />;
}

function BriefField({
  field,
  onChange,
}: {
  field: BriefReviewField;
  onChange: (next: BriefReviewField) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);

  function saveEdit() {
    const value = draft.trim();
    if (!value) return;
    onChange({ ...field, value, status: 'confirmed', origin: 'user' });
    setEditing(false);
  }

  return (
    <section className={`confirm-field confirm-field--${field.status}`}>
      <span className="confirm-field__signal" aria-hidden="true" />
      <div className="confirm-field__heading">
        <div>
          <h2>{field.label}</h2>
          <p>{field.guidance}</p>
        </div>
        {!editing && (
          <button type="button" className="confirm-edit-button" onClick={() => setEditing(true)}>
            <Pencil aria-hidden="true" />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="confirm-field__editor">
          <label>
            <span className="sr-only">Edit {field.label}</span>
            <textarea value={draft} rows={4} onChange={(event) => setDraft(event.target.value)} />
          </label>
          <div>
            <button type="button" className="confirm-save-button" onClick={saveEdit}>
              Save change
            </button>
            <button
              type="button"
              className="confirm-cancel-button"
              onClick={() => {
                setDraft(field.value);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="confirm-field__value">{field.value}</p>
      )}

      <fieldset className="confirm-status-choices">
        <legend>How should Groundwork treat this?</legend>
        <div>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={field.status === option.value ? 'is-selected' : ''}
            >
              <input
                type="radio"
                name={`status-${field.key}`}
                value={option.value}
                checked={field.status === option.value}
                onChange={() => onChange({ ...field, status: option.value })}
              />
              <StatusIcon status={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function ResearchSummary({
  fields,
  questions,
  balance,
  insufficient,
  submitting,
  started,
  onSubmit,
}: {
  fields: BriefReviewField[];
  questions: string[];
  balance: number;
  insufficient: boolean;
  submitting: boolean;
  started: boolean;
  onSubmit: () => void;
}) {
  const deferredCount = fields.filter((field) => field.status === 'investigate').length;
  return (
    <aside className="confirm-research-summary" aria-label="Investigation summary">
      <div className="confirm-summary__heading">
        <span>
          <FileSearch aria-hidden="true" />
        </span>
        <div>
          <p>Investigation handoff</p>
          <h2>What happens next</h2>
        </div>
      </div>

      <dl className="confirm-summary__facts">
        <div>
          <dt>Research scope</dt>
          <dd>Demand, alternatives, feasibility, and business model</dd>
        </div>
        <div>
          <dt>Geography</dt>
          <dd>Australia and New Zealand</dd>
        </div>
        <div>
          <dt>Deliberate unknowns</dt>
          <dd>{deferredCount} included in the research plan</dd>
        </div>
      </dl>

      <section className="confirm-summary__questions">
        <h3>Questions Groundwork will investigate</h3>
        <ol>
          {questions.slice(0, 3).map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section className="confirm-summary__includes">
        <h3>Your report will include</h3>
        <p>Decision guidance, market evidence, competitors, risks, and practical next tests.</p>
      </section>

      <div className="confirm-credit-ledger">
        <div>
          <span>Available now</span>
          <strong>{balance} credits</strong>
        </div>
        <div>
          <span>Investigation cost</span>
          <strong>Set before launch</strong>
        </div>
      </div>

      <p className="confirm-protection">
        <ShieldCheck aria-hidden="true" />
        Credits are reserved when research starts and released if it cannot be completed.
      </p>

      <button
        type="button"
        className="confirm-primary-action"
        disabled={submitting || started}
        onClick={onSubmit}
      >
        {started ? (
          <>
            <CheckCircle2 aria-hidden="true" /> Investigation ready
          </>
        ) : submitting ? (
          'Preparing investigation…'
        ) : insufficient ? (
          <>
            <CircleDollarSign aria-hidden="true" /> Add credits and investigate
          </>
        ) : (
          'Confirm and investigate'
        )}
      </button>
      <Link className="confirm-secondary-action" href="/ideas/idea-01/shape">
        Continue shaping the idea
      </Link>
    </aside>
  );
}

export function ConfirmIdeaExperiment() {
  const [scenarioKey, setScenarioKey] = useState<ConfirmScenarioKey>('ready');
  const scenario = confirmIdeaScenarios[scenarioKey];
  const [fields, setFields] = useState<BriefReviewField[]>(scenario.fields);
  const [questions, setQuestions] = useState<string[]>(scenario.questions);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [showFailure, setShowFailure] = useState(scenario.submissionFailure ?? false);

  const counts = useMemo(
    () => ({
      confirmed: fields.filter((field) => field.status === 'confirmed').length,
      assumption: fields.filter((field) => field.status === 'assumption').length,
      investigate: fields.filter((field) => field.status === 'investigate').length,
    }),
    [fields],
  );

  function changeScenario(next: ConfirmScenarioKey) {
    const nextScenario = confirmIdeaScenarios[next];
    setScenarioKey(next);
    setFields(nextScenario.fields.map((field) => ({ ...field })));
    setQuestions([...nextScenario.questions]);
    setSubmitting(false);
    setStarted(false);
    setShowFailure(nextScenario.submissionFailure ?? false);
  }

  function updateField(key: BriefReviewField['key'], next: BriefReviewField) {
    setFields((current) => current.map((field) => (field.key === key ? next : field)));
    setShowFailure(false);
    setStarted(false);
  }

  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = newQuestion.trim();
    if (!question || questions.includes(question)) return;
    setQuestions((current) => [...current, question]);
    setNewQuestion('');
  }

  function startInvestigation() {
    if (scenario.balance === 0) {
      setStarted(true);
      return;
    }
    setSubmitting(true);
    setShowFailure(false);
    window.setTimeout(() => {
      setSubmitting(false);
      if (scenario.submissionFailure) setShowFailure(true);
      else setStarted(true);
    }, 650);
  }

  return (
    <ProductShell credits={scenario.balance}>
      <main className="confirm-page">
        <header className="confirm-page-header">
          <Link href="/ideas/idea-01/shape" className="confirm-back-link">
            <ChevronLeft aria-hidden="true" />
            Back to Shape
          </Link>
          <div className="confirm-heading-row">
            <div>
              <div className="confirm-stage-line">
                <span>Shape complete</span>
                <i />
                <span>Review before research</span>
              </div>
              <h1>Before we investigate</h1>
              <p>
                Correct anything important, or deliberately hand uncertainty to Groundwork. You do
                not need every answer yet.
              </p>
            </div>
            <div className="confirm-readiness" aria-label="Brief readiness">
              <span>
                <strong>{counts.confirmed}</strong> confirmed
              </span>
              <span>
                <strong>{counts.assumption}</strong> assumptions
              </span>
              <span>
                <strong>{counts.investigate}</strong> to investigate
              </span>
            </div>
          </div>
        </header>

        <section className="confirm-scenario-bar" aria-label="Experiment preview controls">
          <div>
            <span>Preview state</span>
            <small>Development experiment</small>
          </div>
          <select
            value={scenarioKey}
            aria-label="Preview Confirm Idea state"
            onChange={(event) => changeScenario(event.target.value as ConfirmScenarioKey)}
          >
            {Object.values(confirmIdeaScenarios).map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
          <p>{scenario.description}</p>
        </section>

        {showFailure && (
          <section className="confirm-error" role="alert">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>Investigation did not start.</strong>
              <p>Your edits are still here. No credits were reserved, and you can try again.</p>
            </div>
            <button type="button" onClick={() => setShowFailure(false)}>
              Dismiss
            </button>
          </section>
        )}

        {counts.investigate > 0 && (
          <section className="confirm-uncertainty-note">
            <Search aria-hidden="true" />
            <div>
              <strong>Unknowns will not block Investigation.</strong>
              <p>
                Groundwork will explore these possibilities, then make any confidence limits clear
                in the report.
              </p>
            </div>
          </section>
        )}

        <div className="confirm-layout">
          <article className="confirm-brief-paper">
            <header className="confirm-brief-heading">
              <div>
                <p>Idea brief</p>
                <h2>Clinic no-show recovery</h2>
              </div>
              <span>Editable until research begins</span>
            </header>

            <div className="confirm-brief-legend" aria-label="Brief status key">
              {statusOptions.map((option) => (
                <span key={option.value} className={`confirm-legend--${option.value}`}>
                  <StatusIcon status={option.value} />
                  {option.shortLabel}
                </span>
              ))}
            </div>

            <div className="confirm-fields">
              {fields.map((field) => (
                <BriefField
                  key={field.key}
                  field={field}
                  onChange={(next) => updateField(field.key, next)}
                />
              ))}
            </div>

            <section className="confirm-questions-editor">
              <div className="confirm-questions-heading">
                <div>
                  <h2>Questions to investigate</h2>
                  <p>Add anything the report should explicitly test or verify.</p>
                </div>
                <span>{questions.length} saved</span>
              </div>
              <ul>
                {questions.map((question) => (
                  <li key={question}>
                    <Search aria-hidden="true" />
                    <span>{question}</span>
                    <button
                      type="button"
                      aria-label={`Remove question: ${question}`}
                      onClick={() =>
                        setQuestions((current) => current.filter((item) => item !== question))
                      }
                    >
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={addQuestion}>
                <label>
                  <span className="sr-only">Add an investigation question</span>
                  <input
                    value={newQuestion}
                    placeholder="Add a question for the research plan…"
                    onChange={(event) => setNewQuestion(event.target.value)}
                  />
                </label>
                <button type="submit" disabled={!newQuestion.trim()}>
                  <Plus aria-hidden="true" /> Add question
                </button>
              </form>
            </section>
          </article>

          <ResearchSummary
            fields={fields}
            questions={questions}
            balance={scenario.balance}
            insufficient={scenario.balance === 0}
            submitting={submitting}
            started={started}
            onSubmit={startInvestigation}
          />
        </div>

        <footer className="confirm-freeze-note">
          <ShieldCheck aria-hidden="true" />
          <p>
            <strong>This brief freezes only after Investigation starts.</strong> The Shape
            transcript stays available to read, and material changes create a new Idea.
          </p>
        </footer>
        <p className="sr-only" aria-live="polite">
          {submitting ? 'Preparing Investigation.' : started ? 'Investigation action ready.' : ''}
        </p>
      </main>
    </ProductShell>
  );
}
