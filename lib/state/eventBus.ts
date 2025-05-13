type EventCallback<T = unknown> = (data: T) => void;

class EventBus {
  private static instance: EventBus;
  private events: Map<string, EventCallback[]>;

  private constructor() {
    this.events = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.push(callback as EventCallback);

    // 返回取消订阅的函数
    return () => {
      const index = callbacks.indexOf(callback as EventCallback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  public publish<T = unknown>(event: string, data: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  public unsubscribe<T = unknown>(event: string, callback: EventCallback<T>): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback as EventCallback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const eventBus = EventBus.getInstance(); 