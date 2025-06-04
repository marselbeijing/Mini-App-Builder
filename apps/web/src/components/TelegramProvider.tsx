'use client';

import { useEffect, useState } from 'react';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const initTelegram = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        
        // Проверяем версию WebApp перед установкой цветов
        if (WebApp.platform !== 'unknown') {
          try {
            WebApp.setHeaderColor('#1A1B2F');
            WebApp.setBackgroundColor('#1A1B2F');
          } catch (error) {
            console.log('Не удалось установить цвета для Telegram WebApp');
          }
        }
      }
    };

    setIsClient(true);
    initTelegram();
  }, []);

  return <>{children}</>;
} 