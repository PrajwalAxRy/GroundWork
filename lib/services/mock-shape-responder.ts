import type { ShapeSession } from '@/lib/contracts/product';

export type MockShapeReply = {
  body: string;
  note?: string;
  investigationQuestion?: string;
};

export type MockShapeResponder = (
  session: ShapeSession,
  userMessage: string,
) => Promise<MockShapeReply>;

const currentEvidencePattern =
  /\b(latest|currently|today|market size|competitors?|competition|pricing|revenue|regulations?|laws?|industry trends?|statistics?)\b/i;

/**
 * Prototype-only reply generation. It demonstrates the UI and the no-internet
 * boundary; it is not intended to approximate the future Shape model.
 */
export const createMockShapeReply: MockShapeResponder = async (session, userMessage) => {
  if (currentEvidencePattern.test(userMessage)) {
    return {
      body: 'That needs current evidence, so I will not guess from memory. I have saved it for Investigation, where Groundwork can verify it with live research. Before then, what result would materially change your decision about this idea?',
      note: 'Saved for live research during Investigation',
      investigationQuestion: userMessage.trim(),
    };
  }

  const completedUserTurns = session.messages.filter((message) => message.role === 'user').length;
  const replies = [
    'That makes the starting point clearer. Who feels this problem most sharply, and what are they doing when it happens?',
    'The customer is becoming more specific. What is the smallest outcome they would value enough to try or pay for?',
    'That narrows the promise. What do they use instead today, even if it is a manual workaround?',
    'There is a plausible first version here. Which assumption would make the idea fall apart if it proved false?',
  ] as const;

  return { body: replies[completedUserTurns % replies.length] };
};
