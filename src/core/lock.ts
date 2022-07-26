import { EventEmitter } from 'events';
import { logger } from './logger';

export class Lock {
  private locks = new Map<string, number>();
  private event = new EventEmitter();

  async lock(key) {
    if (!this.locks.has(key)) {
      const serial = 0;
      this.locks.set(key, serial);
      return serial;
    }
    const currentSerial = this.locks.get(key);
    const lockKey = `${key}_${currentSerial}`;
    const serial = currentSerial + 1;
    this.locks.set(key, serial);
    return new Promise((resolve, reject) => {
      let resolved = false;
      this.event.once(lockKey, () => {
        resolved = true;
        resolve(serial);
      });
      setTimeout(() => {
        if (!resolved) {
          logger.error(`异步锁超时:${lockKey}`);
          reject('异步锁超时');
        }
      }, 5000);
    });
  }

  unlock(key) {
    if (!this.locks.has(key)) {
      return 0;
    }
    const currentSerial = this.locks.get(key);
    const serial = currentSerial - 1;
    const lockKey = `${key}_${serial}`;
    if (serial <= 0) {
      this.locks.delete(key);
    } else {
      this.locks.set(key, serial);
    }
    if (this.event.listenerCount(lockKey) > 0) {
      this.event.emit(lockKey);
    }
    return serial;
  }
}
