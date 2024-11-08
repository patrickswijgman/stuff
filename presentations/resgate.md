# Preface

Light theme, set slides options at the top:

```
theme: https://raw.githubusercontent.com/charmbracelet/glamour/refs/heads/master/styles/light.json
```

Start alacritty with (alacritty -o 'colors.primary.background="#ffffff"')

---

```
~~~cowsay -f dragon-and-cow
Snacktech time!
~~~
```

---

# Resgate

**Getting the latest data - and changes - in real time**

---

# Topics

1. NATS
2. Resgate general info
3. Resgate deep dive
4. Resgate client

_From a frontend perspective_

---

# NATS

- a messaging system between services in real time
- publish/subscribe architecture
- subscribe to any topic and publish messages on it
- topics can have any name and messages can have any format
- very flexible

## Analogy

Slack

- topic -> channel
- message -> message
- users join a channel they are interested in and can read and send messages

_NATS is like Slack but for services instead of users_

---

# NATS example

**Topic**

`dev.programming_languages.rust`

**Message**

```json
{
  "title": "Greetings!",
  "message": "Welcome to Rust! My name is Ferris the Crab."
}
```

Here is some cute little ASCII art of Ferris:

```
    _~^~^~_
\) /  o o  \ (/
  '_   ¬   _'
  \ '-----' /
```

---

# NATS architecture

```
~~~graph-easy --as=boxart
[ VoIPGRID ],[ Holodeck service ] - connection -> [ NATS ]
~~~
```

---

# What is Resgate?

- a standard on top of NATS (the RES protocol)
- topics and messages have a specific format according to the RES protocol

---

# Resgate architecture

```
~~~graph-easy --as=boxart
[ Frontend ] - websocket -> [ Resgate ]
[ Resgate ] - connection -> [ NATS ]
[ VoIPGRID ] - connection -> [ NATS ]
[ Holodeck service ] - connection -> [ NATS ]
~~~
```

---

# Why Resgate?

Resgate removes pain points for all of us

## User

- data is synchronized for all users in real time

## Frontend developer

- no need to implement polling mechanisms
- no need to implement caching mechanisms
- no need to implement reconnection strategies

## Backend developer

- a standard way to implement services
- a way to implement endpoints
- a way to handle authentication
- a way to handle access

---

# Good to know on how we use Resgate

- we use it to GET data in real time
- we don't use it to POST, PUT, DELETE data, we use REST for that

---

# Resgate deep dive

1. resources
2. topics
3. rid (resource id)

_Taking Dashboard Data service (queues) as an example_

---

# Resources

Resgate knows a couple of data structures called 'resources'

## Model

A single data object

## Collection

A list of models

---

# Topics

Topics are a way to access resources and listen to events when you subscribe to them.

1. resource topics
2. access topics
3. event topics
4. authentication topics

_The Resgate SDKs will help you implement all of this_

---

# Resource topics

Subscribe to these topics to get the latest data

## Format

`get.<resourceName>`

## Examples

- `get.dashboard.client.*` (collection)
- `get.dashboard.client.*.queue.*` (model)

---

# Access topics

These are required for the corresponding resource topic

_Here you can use the VoIPGRID user's permissions_

## Format

`access.<resourceName>`

## Examples

- `access.dashboard.client.*` (collection)
- `access.*.client.*` (from Auth service)

---

# Event topics

These are used to listen to changes in the data

## Format

`event.<resourceName>.<event>`

## Examples

- `event.dashboard.client.*.add` (collection add event)
- `event.dashboard.client.*.remove` (collection remove event)
- `event.dashboard.client.*.queue.*.change` (model change event)

---

# Authentication topics

These are used to authenticate users

_This is where we use the VoIPGRID user's API token_

## Format

`auth.<resourceName>.<method>`

## Examples

- `auth.usertoken.login` (from Auth service)

---

# RID (Resource ID)

The RID is a unique identifier for a resource

## Format

`<resourceName>.<resourceId>`

## Examples

- `dashboard.client.<client-uuid>.queue.<queue-id>`

---

# Resgate client

1. connecting
2. authentication
3. getting data
4. listening to events

---

# Connecting

```javascript
import { ResClient } from "@spindle/resclient";

const client = new ResClient("<ws-url-to-resgate-service>");
```

---

# Authentication

```javascript
const token = await getApiTokenFromVoipgrid();

await client.authenticate("usertoken", "login", { token });
```

---

# Getting data

```javascript
const clientUuid = getClientUuid();

const collection = client.get(`dashboard.client.${clientUuid}`);
```

---

# Listening to events

```javascript
// Collection events

collection.on("add", ({ value, idx }) => {
  console.log("Added", value, "at index", idx);
});

collection.on("remove", ({ idx }) => {
  console.log("Removed item at index", idx);
});

// Model events

for (const model of collection) {
  model.on("change", (oldValues, updatedModel) => {
    console.log("Model changed", oldValues, updatedModel);
  });
}
```

_The SDK only subscribes to resources if there are event listeners_

---

# Demo

```

                   ,~.
                ,-'__ `-,
               {,-'  `. }              ,')
              ,( a )   `-.__         ,',')~,
             <=.) (         `-.__,==' ' ' '}
               (   )                      /
                `-'\   ,                  )
                    |  \        `~.      /
                    \   `._        \    /
                     \     `._____,'   /
                      `-.            ,'
                         `-.      ,-'
                            `----'
                            //_||
                         __//--'/`
                       ,--'/`  '
                          '
```

---

# Checkout

- you can always come to me if you have any questions
- checkout the Resgate site for the tutorial -> https://resgate.io/

```
~~~cowsay -f stegosaurus
Questions?
~~~
```
