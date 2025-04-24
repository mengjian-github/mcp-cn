'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export const Toaster = () => {
  return <HotToaster containerStyle={{ zIndex: 1000 }} toastOptions={{ style: { zIndex: 1000 } }} />;
}; 