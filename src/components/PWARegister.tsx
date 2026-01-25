'use client';

import { usePWA } from '@/hooks/usePWA';

export default function PWARegister() {
  // This component just registers the service worker on mount
  usePWA();
  return null;
}
