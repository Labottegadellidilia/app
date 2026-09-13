// Service Worker — La Bottega dell'Idilia (schermata Bar)
// Riceve le notifiche push anche quando il browser è chiuso e le mostra come notifica di sistema.

self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event){
  let data = {};
  try{
    data = event.data ? event.data.json() : {};
  }catch(e){
    data = { title: 'La Bottega dell\'Idilia', body: event.data ? event.data.text() : 'Nuovo ordine al bar' };
  }

  const title = data.title || 'Nuovo cocktail 🍸';
  const options = {
    body: data.body || 'C\'è un nuovo ordine da preparare.',
    tag: data.tag || 'cocktail-order',
    renotify: true,
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    data: { url: data.url || './app-ristorante.html?bar=1' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './app-ristorante.html?bar=1';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for (const client of clientList){
        if (client.url.indexOf('bar=1') !== -1 && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
