import { Metadata } from 'next';
import { Container } from '@/app/components/common/container';
import SearchPage from './components/search';

export const metadata: Metadata = {
  title: 'Service and Events',
  description: 'Kids Church - Service and Events',
};

export default function Page() {
  return (
    <>
      <Container>
        <SearchPage />
      </Container>
    </>
  );
}
