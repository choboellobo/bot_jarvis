"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
new bot_1.default();
const express = require("express");
const app = express();
app.get('/', (req, res) => {
    res.json({ app: "working" });
});
app.listen(4000);
//# sourceMappingURL=index.js.map