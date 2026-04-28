import { Injectable, signal } from '@angular/core';

const MOCK_MODE_STORAGE_KEY = 'disparador-email:mock-mode';

@Injectable({ providedIn: 'root' })
export class MockApiModeService {
  readonly enabled = signal(this.readInitialValue());

  setEnabled(enabled: boolean): void {
    this.enabled.set(enabled);
    globalThis.localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(enabled));
  }

  private readInitialValue(): boolean {
    return globalThis.localStorage.getItem(MOCK_MODE_STORAGE_KEY) === 'true';
  }
}
