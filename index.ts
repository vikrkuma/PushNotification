declare var window: WindowOrWorkerGlobalScope;


/**
 * PUBLIC Key used to encrypt and authenticate push subscription data.
 */
const PUBLIC_VAPID_KEY =
  'BCX8YyX8ZOlcT2ToVtRxm2Vz6XE_D9tEf6m5-9ulRvYsH80vjNdLcqZ9aB2zV265HDHjR827BYN09gXf2l8MDtM';


  /**
   * Main function: checks if service worker is supported and sends the request
   * to server to send a notification to the browser.
   */
function main() {
  if ('serviceWorker' in navigator) {
    send().catch(error => console.log(error));
  }
}


/**
 * Registers the service worker file and sends the request to server to send a
 * notification to the browser.
 */
async function send() {
  const register = await navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  });

  const subscription = await setPushManager(register);

  sendNotification(subscription);
}


/**
 * Prompts the user to enable the push notification from given server and if
 * the access is allowed then subscribe to the browsers push service.
 * @param register Registration obtained after installing service worker.
 * @returns Subscription to the browser's push service.
 */
async function setPushManager(register: ServiceWorkerRegistration):
  Promise<PushSubscription> {
  const subscription = await register.pushManager.getSubscription();

  if (!subscription) {
    throw 'Notification has been disabled by the user.';
  }

  const applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
  return await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });
}


/**
 * Sends the browser's push service endpoint and the encryption key data to the
 * server to store, which will be used by it to send the messages as push
 * messages.
 * @param subscription Subscription to the browser's push service.
 */
function sendNotification(subscription: PushSubscription) {
  fetch('/subscribeNotification', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
}


/**
 * Converts the 64 base encryption key to 8 bits integer list.
 * @param base64String Encryption key.
 * @returns List of 8 bits data converted from input encryption key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}


// Call the main function to bootstrap the main application.
main();
