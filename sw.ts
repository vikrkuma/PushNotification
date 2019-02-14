const sw = self as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json();
  sw.registration.showNotification(data.title, {
    body: 'Notified...',
    icon: 'notification.png',
  });
});

