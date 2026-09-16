'use client';

import { Button, IconButton, Menu } from '@/components/ui/product-primitives';
import { PROTOTYPE_INITIAL_CREDITS } from '@/lib/config/prototype-commercial';
import { Coins, UserRound } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function GroundworkMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 25 16 6l10 19h-5l-5-10-5 10H6Z" />
      <path d="M11 25h10" />
    </svg>
  );
}

export function ProductShell({
  children,
  credits = PROTOTYPE_INITIAL_CREDITS,
}: { children: ReactNode; credits?: number }) {
  return (
    <div className="gw-product">
      <header className="topbar">
        <Link className="brand" href="/ideas" aria-label="Groundwork, return to your ideas">
          <GroundworkMark />
          <span>Groundwork</span>
        </Link>
        <nav aria-label="Account">
          <Link className="credits" href="/credits" aria-label={`${credits} credits, open credits`}>
            <Coins aria-hidden="true" />
            <span>
              <strong>{credits}</strong> credits
            </span>
          </Link>
          <Menu
            trigger={
              <IconButton className="profile" label="Open profile menu">
                <UserRound aria-hidden="true" />
              </IconButton>
            }
          >
            <strong>Prototype account</strong>
            <Button variant="text" disabled>
              Account settings
            </Button>
            <Button variant="text" disabled>
              Sign out
            </Button>
          </Menu>
        </nav>
      </header>
      {children}
    </div>
  );
}
