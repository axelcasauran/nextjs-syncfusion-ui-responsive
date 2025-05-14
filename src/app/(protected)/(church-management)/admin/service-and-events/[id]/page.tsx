'use client';

import React, { use } from 'react';
import { Container } from '@components/common/container';
import RecordPage from './components/record';

export default function Page({params}: {params: Promise<{ id: string }>;}) {
  const { id } = use(params);
  const isLoading = false;

  return (
    <>
      <Container>
        <RecordPage id={id} isLoading={isLoading} />
      </Container>
    </>
  );
}
