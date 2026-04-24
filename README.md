# Disparador de E-mails (Front-end)

Aplicação Angular para operação da API de disparo de e-mails, com módulos para contatos, tags, templates, campanhas e manutenção.

## Stack

- Angular 21 (componentes standalone + lazy loading por rota)
- Angular Material (UI, tabelas, dialogs, snackbars)
- TailwindCSS (layout utilitário e responsivo)
- HttpClient com interceptors para base URL, loading global e tratamento de erro
- Formulários reativos com validações

## Setup

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
npm install
```

### Rodar localmente

```bash
npm start
```

A aplicação estará em `http://localhost:4200`.

> A API esperada está em `http://localhost:3334` por padrão.

## Ambiente

Configuração em `src/environments/environment*.ts`:

```ts
apiBaseUrl: 'http://localhost:3334'
```

## Estrutura de pastas

- `src/app/core/models`: DTOs/interfaces tipadas
- `src/app/core/services`: serviços HTTP por domínio
- `src/app/core/interceptors`: interceptors globais
- `src/app/features`: telas por domínio (feature-first)
- `src/app/shared`: componentes e utilitários reutilizáveis

## Mapeamento telas -> endpoints

### Dashboard (`/`)
- `GET /templates`
- `POST /d555a343/tags`
- `POST /321sasr323/delContatos`

### Importar Contatos (`/importar-contatos`)
- `POST /b0cbf7/list`

### Tags & Contatos (`/tags-contatos`)
- `POST /d555a343/tags`
- `GET /abc/list/:tagId`

### Templates (`/templates`)
- `POST /templates`
- `GET /templates`
- `PUT /templates/:templateId`
- `DELETE /templates/:templateId`

### Disparo (`/disparo`)
- `POST /f45f76/messages`

### Manutenção (`/manutencao`)
- `POST /CS2aa3242/contact/:contact`
- `PUT /CS2aa3242/contact`
- `PUT /321sasr323/delContatos/:contact`

### Contatos Removidos (`/contatos-removidos`)
- `POST /321sasr323/delContatos`

### Ferramentas (`/ferramentas`)
- `POST /a89sdyhsad78/xmailerReportError`

### Unsubscribe (`/unsubscribe`)
- Tela amigável para uso com links do endpoint `GET /dltM?...`

## Tratamento defensivo adotado

- Endpoint de remoção manual retorna tipo não determinístico; a UI trata resposta como `unknown` e aplica fallback textual amigável.
- Mensagens de erro usam prioridade para `error.message` do backend e fallback por status HTTP (400/404/500/0).
- E-mails são normalizados para lowercase e trim antes de operações críticas de manutenção.

## Endpoints sem UI administrativa

- `POST /Bounce`
- `POST /Complaint`

Mantidos apenas como documentação, por serem webhooks SES.

## Testes

```bash
npm test
```

Cobertura inicial inclui serviços de contatos e templates, além do shell principal da aplicação.
