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

Topic

`dev.programming_languages.rust`

Message

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
- frontend connection to Resgate is via a websocket

## Glossary

| Term       | Description             |
| ---------- | ----------------------- |
| model      | a single data object    |
| collection | a list of models        |
| resource   | a model or a collection |

## Example

Topic

`get.dev.programming_languages.*` (get collection)

`get.dev.programming_languages.1` (get model)

`access.dev.programming_languages.*` (access handler for collection resource)

`event.dev.programming_languages.add` (collection add event)

`event.dev.programming_languages.1.change` (model change event)

Message (raw data)

```json
{
  "id": "1", // Message ID
  "result": {
    "models": {
      "dev.programming_languages.1": {
        "name": "Rust",
        "mascot": "Ferris the Crab"
      },
      "dev.programming_languages.2": {
        "name": "Golang",
        "mascot": "Gopher"
      }
    },
    "collections": {
      "dev.programming_languages": [
        { "rid": "dev.programming_languages.1" },
        { "rid": "dev.programming_languages.2" }
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
- access handlers are required for each resource
- emits updates as they happen in real time
- polling is no longer needed for frontend updates
