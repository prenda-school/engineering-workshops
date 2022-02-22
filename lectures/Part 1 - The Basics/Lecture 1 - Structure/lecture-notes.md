## Basic structure of a remix app

```
my-remix-app
├── README.md
├── app
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   └── routes
│       └── index.tsx
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── remix.config.js
├── remix.env.d.ts
└── tsconfig.json
```

A short explanation of the files:

- `app/` This is where your app code lives
- `app/entry.client.tsx` This is the first part of the javascript that will run
  in the app. It is used to hydrate the React components.
- `app/entry.server.tsx` This is the first bit of javascript that runs when your
  request arrives at the server. Remix handles loading all the necessary data and
  you're responsible for sending back the response. We'll use this file to render
  our React app to a string/stream and send that as our response to the client.
- `app/root.tsx` This is the root component for our application. The `<html>`
  element is rendereded here element here.
- `app/routes/*` This is where all your "route modules" will go. Remix uses the
  files in this directory to create the URL routes for your app based on the name
  of the files.
- `public/` This is where your static assets go (images/fonts/etc)
- `remix.config.js` Remix has a handful of configuration options you can set in this file.
