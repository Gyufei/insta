"use client";

import React from 'react';

import { EmptyState } from '@/components/common/empty-state';

interface PositionsEmptyProps {
  isEmpty: boolean;
  hasFilterApplied: boolean;
  emptyMessage?: React.ReactNode;
  notFoundMessage?: React.ReactNode;
}

export function PositionsEmpty({
  isEmpty,
  hasFilterApplied,
  emptyMessage,
  notFoundMessage,
}: PositionsEmptyProps) {
  const defaultEmptyMessage = (
    <>
      You have no active positions. <br />
      Create a position to get started!
    </>
  );
  const defaultNotFoundMessage = (
    <>
      No positions found. <br />
    </>
  );

  const message = isEmpty
    ? emptyMessage ?? defaultEmptyMessage
    : hasFilterApplied
      ? notFoundMessage ?? defaultNotFoundMessage
      : defaultNotFoundMessage;

  return <EmptyState message={message} />;
}