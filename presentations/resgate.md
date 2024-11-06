# Resgate

```
~~~cowsay -f dragon-and-cow
Snacktech time!
~~~
```

---

# NATS

- a messaging system between services
- publish/subscribe model
- subscribe to any topic and publish messages on it
- topics can have any name and messages can have any format
- very flexible

## Analogy

Slack

- topic -> channel
- message -> message
- users join a channel they are interested in and can read and send messages

## Example

**Topic**

`dev.programming_languages.rust`

**Message**

```json
{
  "title": "Greeting!",
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

## Example

```
~~~graph-easy --as=boxart
[ Admin ] - create new user -> [ VoIPGRID ]
[ VoIPGRID ] - event.user.add -> [ UserProfiles ]
[ UserProfiles ] - store user data -> [ Database ]
~~~
```

---

# What is Resgate?

- a standard on top of NATS (the RES protocol)
- topics and messages have a specific format according to the RES protocol
- handles authentication and access control
- frontend connection to Resgate is via a websocket

## Glossary

| Term       | Description             |
| ---------- | ----------------------- |
| model      | a single data object    |
| collection | a list of models        |
| resource   | a model or a collection |
| rid        | a resource identifier   |

---

# Resgate NATS topics

**Formats**

For resource requests:

`get.<resourceName>` e.g. `get.dev.programming_languages.language.1`

For resource access:

`access.<resourceName>` e.g. `access.dev.programming_languages.>`

For events:

`event.<resourceName>.<event>` e.g. `event.dev.programming_languages.add`

_resourceName can be anything you want_

---

# Resgate message

Raw data when you request a collection:

```json
{
  "id": "1", // Message ID
  "result": {
    "models": {
      "dev.programming_languages.language.1": {
        "name": "Rust",
        "mascot": "Ferris the Crab"
      },
      "dev.programming_languages.language.2": {
        "name": "Golang",
        "mascot": "Gopher"
      }
    },
    "collections": {
      "dev.programming_languages": [
        { "rid": "dev.programming_languages.language.1" },
        { "rid": "dev.programming_languages.language.2" }
      ]
    }
  }
}
```

_The frontend/backend SDKs will help you implement all of these things._

---

# Resgate architecture

```
~~~graph-easy --as=boxart
[ Frontend ] - websocket -> [ Resgate ]
[ Resgate ] - connection -> [ NATS ]
[ VoIPGRID ] - Plain NATS -> [ NATS ]
[ Holodeck service ] - Resgate SDK -> [ NATS ]
~~~
```

---

# What does Resgate solve?

- standardizes the way services communicate
- handles access to each resource (required)
- handles authentication to resources
- emits updates as they happen in real time
- polling is no longer needed for frontend updates

---

# Good to know

- we only use it to GET data
- we don't use it to POST, PUT, DELETE data, we use REST for that
- Resgate can do this, however but we decided we don't want to, ask Lucas :P
