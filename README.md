# PostChat Typescript SDK
Node.js client library for using the PostChat APIs.

# Getting started
Installation
``` sh
$ npm install @postchat/postchat-apis
```

```javascript
import { PostChat } from '@postchat/postchat-apis';

const postChat = new PostChat(apiKey);
// or
const postChat = await PostChat.create(username, password, isBot);
```
