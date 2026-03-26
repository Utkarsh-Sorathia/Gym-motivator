import PushNotifications from '@pusher/push-notifications-server';
import { NextResponse } from 'next/server';
import { morningQuotes, preWorkoutQuotes, eveningQuotes } from '@/lib/quotes';

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || '00000000-0000-0000-0000-000000000000',
  secretKey: process.env.PUSHER_BEAMS_SECRET_KEY || 'your_secret_key',
});

const getRandomQuote = (quotesArray: string[]) => {
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, secret } = body;

    // Secure the webhook endpoint for external cron jobs like GitHub Actions.
    if (secret !== process.env.NOTIFICATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized webhook call' }, { status: 401 });
    }

    let title = '';
    let bodyText = '';
    const interest = eventType; // Should be 'morning', 'workout', or 'evening'

    switch (eventType) {
      case 'morning':
        title = 'Morning Kickstart 💼';
        bodyText = getRandomQuote(morningQuotes);
        break;
      case 'workout':
        title = 'Pre-Workout Call 💪';
        bodyText = getRandomQuote(preWorkoutQuotes);
        break;
      case 'evening':
        title = 'Evening Reflection 🌙';
        bodyText = getRandomQuote(eveningQuotes);
        break;
      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }

    // Determine the base URL dynamically based on the incoming request (Vercel or Localhost)
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    const publishResponse = await beamsClient.publishToInterests([interest], {
      web: {
        notification: {
          title,
          body: bodyText,
          icon: `${baseUrl}/icon-192x192.png`,
          // @ts-expect-error - 'badge' and 'vibrate' are valid Web Push attributes
          badge: `${baseUrl}/badge.png`,
          deep_link: `${baseUrl}/schedule`,
          // A gym-style heavy vibration pattern: [vibrate, pause, vibrate, pause, vibrate]
          vibrate: [300, 100, 400, 100, 400],
        },
      },
      fcm: {
        notification: {
          title,
          body: bodyText,
          // Requests Android OS to play the default notification sound
          sound: 'default'
        }
      },
      apns: {
        aps: {
          alert: {
            title,
            body: bodyText,
          },
          // Requests iOS to play the default notification sound
          sound: 'default'
        }
      }
    });

    console.log('Successfully published push notification:', publishResponse);
    return NextResponse.json({ success: true, publishId: publishResponse.publishId, quoteSent: bodyText });
  } catch (error: any) {
    console.error('Push Notification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
