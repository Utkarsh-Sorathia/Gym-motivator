"use client";
import { useCallback, useEffect, useState } from 'react';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

const PUSHER_INSTANCE_ID = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || '';

export function usePusher() {
  const [beamsClient, setBeamsClient] = useState<any>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const initPusher = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && PUSHER_INSTANCE_ID) {
        try {
          await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker Registered');

          const client = new PusherPushNotifications.Client({
            instanceId: PUSHER_INSTANCE_ID,
          });

          await client.start();
          setBeamsClient(client);

          // Check if already subscribed to anything
          const interests = await client.getDeviceInterests();
          if (interests.length > 0) setPushEnabled(true);
        } catch (error) {
          console.warn('Silent fallback: Notifications unavailable in this browser context (e.g. Incognito).', error);
        }
      }
    };

    initPusher();
  }, []);

  const subscribeToTopics = useCallback(async (topics: string[]) => {
    if (!beamsClient) {
      console.warn("Pusher Beams client not initialized yet.");
      return;
    }
    try {
      if (topics.length > 0) {
         await beamsClient.setDeviceInterests(topics);
         setPushEnabled(true);
         console.log("Subscribed to:", topics);
      } else {
         await beamsClient.clearDeviceInterests();
         setPushEnabled(false);
         console.log("Cleared subscriptions");
      }
    } catch (e) {
      console.warn('Could not subscribe to push topics (likely disabled by browser):', e);
    }
  }, [beamsClient]);

  return { beamsClient, pushEnabled, subscribeToTopics };
}
