const sw = self as ServiceWorkerGlobalScope;


/**
 * Listens to the push messages received from the server and show the
 * notification panel.
 */
sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json();
  sw.registration.showNotification(data.title, {
    body: 'Notified...',
    icon: 'notification.png',
  });
});

