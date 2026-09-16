# Groundwork AI Behavior and Reliability Contract

Status: Product-level AI contract. Exact providers, models, schemas, prompts, and infrastructure remain to be finalized.

## 1. Core Ownership Rule

> Groundwork controls the product structure. AI researches and fills it.

The backend and frontend own:

- Core report sections and ordering
- Allowed module and component types
- Enum values and state names
- Layout and responsive behavior
- Credit prices and product names
- Which tools each AI surface can access
- Validation, retries, persistence, and display rules

AI owns, within those boundaries:

- Conversation responses
- Idea interpretations and suggestions
- Research plans
- Evidence collection
- Competitor and market findings
- Verdict reasoning
- Roadmap content
- Optional section proposals

AI must not generate arbitrary HTML, React, credit prices, product identifiers, or frontend component definitions.

## 2. Structured Output Principle

All AI output that drives product state must use a versioned structured schema.

The safe path is:

```text
AI output
  -> schema validation
  -> business-rule validation
  -> targeted repair or retry when required
  -> persistent storage
  -> deterministic frontend rendering
```

The frontend renders only validated stored data. It never renders raw model output as a component definition.

Schema compliance prevents malformed shapes, but it does not guarantee factual accuracy. Evidence collection and verification are separate responsibilities.

## 3. Shape Assistant Contract

### Tools

The Shape assistant has no internet or web-search tools.

### Response behavior

Most responses should:

1. React specifically to the user's message.
2. Add value through reasoning, a suggestion, or a constructive challenge.
3. Ask no more than one main question.

It should sometimes propose likely options rather than forcing the user to invent an answer.

### Research deferral

When a request requires current external facts, the assistant must say that Investigation will verify it and record an open research question.

It must not claim to have searched the internet or present stale model memory as current research.

### Brief state

The hidden Idea Brief tracks field-level provenance:

- Confirmed
- Inferred
- Suggested
- Unknown
- Conflicting

A possible response envelope is:

```json
{
  "reply": "The assistant message shown in chat",
  "briefPatch": {},
  "nextFocus": "target_customer",
  "readiness": "partially_ready",
  "openQuestions": []
}
```

This is illustrative, not the final schema.

### Readiness

The assistant may recommend review, but it must never prevent the user from ending Shape early. Unknowns can be marked for Investigation.

## 4. Idea Brief Contract

The final schema should cover at least:

- Raw or normalized Idea statement
- Problem
- Target user
- Buyer
- Proposed solution
- Value proposition
- Alternatives
- Geography
- Business model
- Distribution hypothesis
- Founder constraints or advantages
- Critical assumptions
- Questions to investigate

Every field needs a controlled status. The lightweight in-Shape review modal confirms only that the current Idea summary looks right to the user. It must not convert inferred, suggested, conflicting, or unknown fields into confirmed facts. After acceptance, the conversation is paused for review but remains reversible through **Continue shaping**. Field corrections and requests to investigate uncertainty are captured through the Shape conversation.

Once Investigation begins, the Idea Brief is immutable.

## 5. Investigation Pipeline

The recommended product behavior is a controlled pipeline rather than one giant prompt or an unconstrained autonomous agent swarm.

1. Normalize the confirmed Idea Brief.
2. Classify the Idea type and choose an analysis playbook.
3. Produce a research plan and required questions.
4. Run targeted research for customers, demand, competition, business model, and feasibility.
5. Normalize evidence and sources.
6. Synthesize a strict report object.
7. Verify claims, source coverage, contradictions, and required sections.
8. Store the immutable report.
9. Consume reserved credits only after the quality gate passes.

Specialized or parallel research workers may be introduced later, but the external result must still satisfy one controlled report contract.

## 6. Research Tools and Evidence

Investigation uses live internet research.

Research records should preserve:

- Source identifier
- Title
- Publisher or domain
- URL
- Access date
- Claims supported
- Evidence quality
- Whether the content is fact, estimate, or Groundwork inference

The user sees a consolidated, collapsed source list at the end. Internal claim-to-source mappings remain available for verification.

Web content must be treated as untrusted data. Instructions found inside researched pages must never override Groundwork's system or developer instructions.

## 7. Report Structure

The report has fixed core sections and backend-selected playbook modules.

AI may propose an additional section using:

- A registered optional module, or
- A generic insight section made from approved blocks such as prose, evidence rows, key-value facts, simple tables, or timelines

Unknown component types are rejected. The model never controls code or placement coordinates.

Every section reports one of:

- Complete
- Partial
- Insufficient evidence
- Not applicable

Every factual field should be capable of distinguishing:

- Verified fact
- External estimate
- Groundwork inference
- Not found
- Not applicable
- Research error

## 8. Missing and Malformed Output

### Required data

Missing critical content triggers targeted repair or retry before a report is marked complete.

### Optional data

Optional fields may be absent. Components must collapse naturally rather than display empty rows.

### Evidence gaps

An evidence gap is not the same as a technical failure. State the limitation clearly and continue when the remaining report still passes its quality threshold.

### Overall failure

If the report cannot pass the quality gate:

- Do not present it as complete.
- Release reserved credits.
- Preserve a recoverable job state.
- Offer an appropriate retry.

### Versioning

Structured objects require `schemaVersion`. Schema migrations must preserve renderability of existing purchased content.

## 9. Roadmap Generation

Roadmap generation uses the frozen Idea Brief and completed Investigation as its primary context.

It returns:

- Recommended path
- Three to five milestone-overview items
- Zero to three pre-build experiments
- Three to five detailed phases

Each detailed phase requires:

- Objective
- Up to three important actions
- Milestone
- Primary risk or decision

Optional fields must be omitted gracefully when unsupported. The AI does not control Gantt geometry. The frontend computes the visual sequence.

## 10. Roadmap Follow-up Chat

The Roadmap chat:

- Is free to the user
- Has no internet access
- Uses the frozen Brief, Investigation, Roadmap, and recent chat as context
- Clarifies and breaks down existing material
- May adapt immediate advice to user-provided constraints
- Does not silently modify the stored Roadmap
- Does not spend credits

Requests requiring new facts, a changed Idea, or substantial regeneration are routed to a user-confirmed paid action.

Reasonable technical abuse controls may exist without changing the promise that ordinary follow-up chat is free.

## 11. Credit Safety

AI never decides prices or directly changes balances.

The backend must:

- Reserve credits before paid generation
- Use idempotent operations
- Consume credits after successful quality validation
- Release reservations on terminal failure
- Record a ledger entry
- Require explicit user confirmation for new paid work

## 12. Open Technical Decisions

The following are not yet locked:

- Exact model selection per stage
- Exact JSON Schemas
- Whether Shape uses one combined response or separate conversation and extraction calls
- Research parallelism and job orchestration
- Search and browsing provider configuration
- Retry limits and quality thresholds
- Context compression and retrieval strategy
- Exact abuse limits for free chat
- Observability, evaluations, and prompt versioning

## References

- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI web search](https://developers.openai.com/api/docs/guides/tools-web-search)
- [OpenAI background mode](https://developers.openai.com/api/docs/guides/background)
