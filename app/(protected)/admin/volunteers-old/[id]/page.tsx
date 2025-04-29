'use client';

import { useUser } from './components/volunteer-context';
import UserDangerZone from './components/volunteer-danger-zone';
import UserProfile from './components/volunteer-profile';

export default function Page() {
  const { user, isLoading } = useUser();

  return (
    <div className="space-y-10">
      <UserProfile user={user} isLoading={isLoading} />
      <UserDangerZone user={user} isLoading={isLoading} />
    </div>
  );
}
