# Databases

## Setup

```sh
npm install --save-dev prisma
npm install @prisma/client

npx prisma init --datasource-provider sqlite

```

Create schema:

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Appointment {
  id          Int   @id @default(autoincrement())
  description String
  date        DateTime
  user        User  @relation(fields: [userId], references: [id])
  userId      Int 
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id           Int       @id @default(autoincrement())
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  username     String        @unique
  email        String        @unique
  name         String
  surname      String
  age          Int
  passwordHash String
  role         String          @default("USER") // USER - ADMIN
  appointments Appointment[]
}
```

Migrate:


```sh
npx prisma db push
```

## Avoid closing connection a restarting during development

During development, we don't want to close down and completely restart our server every time we make a server-side change.

A workaround:

```ts
// create a file utils/db.server.ts

import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
```

## Seed data to database

```tsx
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getJokes().map((joke) => {
      return db.joke.create({ data: joke });
    })
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}


```sh
npm install --save-dev esbuild-register
node --require esbuild-register prisma/seed.ts

```