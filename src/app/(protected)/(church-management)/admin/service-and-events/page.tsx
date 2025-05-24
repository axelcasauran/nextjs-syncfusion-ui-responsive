import { Metadata } from 'next';
import { Container } from '@components/common/container';
import SearchPage from './search';

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
