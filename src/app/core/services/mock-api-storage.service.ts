import { Injectable } from '@angular/core';
import { Contact, ImportContactsPayload, UpdateContactEmailPayload } from '../models/contact.model';
import { DeletedContact } from '../models/deleted-contact.model';
import { EnqueueMessagePayload, MessageResponse } from '../models/campaign.model';
import { Tag } from '../models/tag.model';
import { Template, TemplatePayload } from '../models/template.model';

interface MockDatabase {
  contacts: Contact[];
  tags: Tag[];
  templates: Template[];
  deletedContacts: DeletedContact[];
}

const MOCK_DB_STORAGE_KEY = 'disparador-email:mock-db';

const createInitialDatabase = (): MockDatabase => ({
  contacts: [
    {
      _id: crypto.randomUUID(),
      name: 'Contato Demo',
      email: 'demo@empresa.com',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tags: [],
  templates: [
    {
      _id: crypto.randomUUID(),
      subject: 'Boas-vindas',
      html: '<h1>Olá!</h1><p>Este é um template de demonstração.</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  deletedContacts: [],
});

@Injectable({ providedIn: 'root' })
export class MockApiStorageService {
  private readonly storage = globalThis.localStorage;

  listTags(): Tag[] {
    return this.readDatabase().tags;
  }

  createTag(title: string): Tag {
    const database = this.readDatabase();
    const now = new Date().toISOString();
    const tag: Tag = {
      _id: crypto.randomUUID(),
      title,
      sent_mails: 0,
      createdAt: now,
      updatedAt: now,
    };

    database.tags = [...database.tags, tag];
    this.saveDatabase(database);
    return tag;
  }

  updateTag(id: string, title: string): Tag | null {
    const database = this.readDatabase();
    const existing = database.tags.find((tag) => tag._id === id);
    if (!existing) {
      return null;
    }

    const updated: Tag = { ...existing, title, updatedAt: new Date().toISOString() };
    database.tags = database.tags.map((tag) => (tag._id === id ? updated : tag));
    this.saveDatabase(database);
    return updated;
  }

  deleteTag(id: string): boolean {
    const database = this.readDatabase();
    const existing = database.tags.find((tag) => tag._id === id);
    if (!existing) {
      return false;
    }

    database.tags = database.tags.filter((tag) => tag._id !== id);
    database.contacts = database.contacts.map((contact) => ({
      ...contact,
      tags: (contact.tags ?? []).filter(
        (tagValue) => tagValue !== id && tagValue !== existing.title,
      ),
      updatedAt: new Date().toISOString(),
    }));
    this.saveDatabase(database);
    return true;
  }

  listTemplates(): Template[] {
    return this.readDatabase().templates;
  }

  getTemplateById(id: string): Template | null {
    return this.readDatabase().templates.find((template) => template._id === id) ?? null;
  }

  createTemplate(payload: TemplatePayload): Template {
    const database = this.readDatabase();
    const now = new Date().toISOString();
    const template: Template = {
      _id: crypto.randomUUID(),
      subject: payload.subject,
      html: payload.html,
      createdAt: now,
      updatedAt: now,
    };

    database.templates = [...database.templates, template];
    this.saveDatabase(database);
    return template;
  }

  updateTemplate(id: string, payload: TemplatePayload): Template | null {
    const database = this.readDatabase();
    const existing = database.templates.find((template) => template._id === id);
    if (!existing) {
      return null;
    }

    const updated: Template = {
      ...existing,
      subject: payload.subject,
      html: payload.html,
      updatedAt: new Date().toISOString(),
    };

    database.templates = database.templates.map((template) =>
      template._id === id ? updated : template,
    );
    this.saveDatabase(database);
    return updated;
  }

  deleteTemplate(id: string): boolean {
    const database = this.readDatabase();
    const exists = database.templates.some((template) => template._id === id);
    if (!exists) {
      return false;
    }

    database.templates = database.templates.filter((template) => template._id !== id);
    this.saveDatabase(database);
    return true;
  }

  private normalizeTagValues(values: string[], database: MockDatabase): string[] {
    return values.map((value) => {
      const match = database.tags.find((tag) => tag._id === value || tag.title === value);
      return match?.title ?? value;
    });
  }

  importContacts(payload: ImportContactsPayload): { ok: boolean } {
    const database = this.readDatabase();
    const contactsInput = Array.isArray(payload.contacts)
      ? payload.contacts.join('\n')
      : payload.contacts;
    const normalizedTags = this.normalizeTagValues(payload.tags, database);

    const parsedContacts = contactsInput
      .split(/[\n,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.includes('@'));

    const now = new Date().toISOString();
    for (const email of parsedContacts) {
      const existing = database.contacts.find((contact) => contact.email.toLowerCase() === email);
      if (existing) {
        const mergedTags = new Set([...(existing.tags ?? []), ...normalizedTags]);
        existing.tags = Array.from(mergedTags);
        existing.updatedAt = now;
        continue;
      }

      database.contacts.push({
        _id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        tags: normalizedTags,
        createdAt: now,
        updatedAt: now,
      });
    }

    this.saveDatabase(database);
    return { ok: true };
  }

  listContactsByTag(tagId: string): Contact[] {
    const database = this.readDatabase();
    const tag = database.tags.find((item) => item._id === tagId);
    const tagValue = tag?.title ?? tagId;

    return database.contacts.filter((contact) => (contact.tags ?? []).includes(tagValue));
  }

  checkContactExists(email: string): { contactExists: boolean } {
    const normalizedEmail = email.toLowerCase();
    const contactExists = this.readDatabase().contacts.some(
      (contact) => contact.email.toLowerCase() === normalizedEmail,
    );

    return { contactExists };
  }

  updateContactEmail(payload: UpdateContactEmailPayload): Contact | null {
    const database = this.readDatabase();
    const contact = database.contacts.find(
      (item) => item.email.toLowerCase() === payload.contact.toLowerCase(),
    );

    if (!contact) {
      return null;
    }

    contact.email = payload.newEmail.toLowerCase();
    contact.updatedAt = new Date().toISOString();
    this.saveDatabase(database);
    return contact;
  }

  removeContact(email: string): string {
    const database = this.readDatabase();
    const normalizedEmail = email.toLowerCase();
    const index = database.contacts.findIndex(
      (contact) => contact.email.toLowerCase() === normalizedEmail,
    );

    if (index < 0) {
      return 'Contato não encontrado.';
    }

    const [removed] = database.contacts.splice(index, 1);
    database.deletedContacts = [
      {
        _id: crypto.randomUUID(),
        email: removed.email,
        reason: 'Removido manualmente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...database.deletedContacts,
    ];

    this.saveDatabase(database);
    return 'Contato removido.';
  }

  listDeletedContacts(): DeletedContact[] {
    return this.readDatabase().deletedContacts;
  }

  removeXMailerErrors(): MessageResponse {
    return { message: 'Erros de XMailer removidos (mock).' };
  }

  enqueueMessage(payload: EnqueueMessagePayload): MessageResponse {
    const database = this.readDatabase();
    const template = database.templates.find((item) => item._id === payload.templateId);
    const normalizedTags = this.normalizeTagValues(payload.tags, database);
    const recipients = database.contacts.filter((contact) =>
      normalizedTags.some((tagValue) => (contact.tags ?? []).includes(tagValue)),
    );

    return {
      message: template
        ? `Disparo em fila para ${recipients.length} contato(s) usando "${template.subject}".`
        : `Disparo em fila para ${recipients.length} contato(s).`,
    };
  }

  private readDatabase(): MockDatabase {
    const raw = this.storage.getItem(MOCK_DB_STORAGE_KEY);
    if (!raw) {
      const initial = createInitialDatabase();
      this.saveDatabase(initial);
      return initial;
    }

    try {
      return JSON.parse(raw) as MockDatabase;
    } catch {
      const initial = createInitialDatabase();
      this.saveDatabase(initial);
      return initial;
    }
  }

  private saveDatabase(database: MockDatabase): void {
    this.storage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(database));
  }
}
