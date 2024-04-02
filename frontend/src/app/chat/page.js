'use client';

import { ChatProvider } from '../../store/chatStore';
import Layout from '../../components/Layout';

export default function Home() {
  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  );
}