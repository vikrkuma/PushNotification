declare var window: WindowOrWorkerGlobalScope;

const PUBLIC_VAPID_KEY =
  'BCX8YyX8ZOlcT2ToVtRxm2Vz6XE_D9tEf6m5-9ulRvYsH80vjNdLcqZ9aB2zV265HDHjR827BYN09gXf2l8MDtM';

function main() {
  if ('serviceWorker' in navigator) {
    send().catch(error => console.log(error));
  }
}

async function send() {
  const register = await navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  });

  const subscription = await setPushManager(register);

  sendNotification(subscription);
}

async function setPushManager(register: ServiceWorkerRegistration):
  Promise<PushSubscription> {
  const permission = await register.pushManager.permissionState();

  if (permission === 'denied') {
    throw 'Notification has been disabled by the user.';
  }

  const applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
  return await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });
}

function sendNotification(subscription: PushSubscription) {
  fetch('/subscribeNotification', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

main();
