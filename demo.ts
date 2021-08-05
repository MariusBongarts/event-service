import { eventService } from './event-service';

eventService.subscribe('onElementCreated', test => console.log(test));

setTimeout(() => {
  eventService.emit('onElementCreated', { id: '' });
}, 1000);