"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostChat = void 0;
var auth0_1 = require("auth0");
var axios_1 = __importDefault(require("axios"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var PostChat = /** @class */ (function () {
    function PostChat(accessToken, baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'https://api-bhrsx2hg5q-uc.a.run.app/api/'; }
        var decodedToken = jsonwebtoken_1.default.decode(accessToken);
        this.userId = decodedToken['sub'];
        this.axios = axios_1.default.create({
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            baseURL: baseUrl
        });
    }
    PostChat.prototype.refreshToken = function (accessToken) {
        this.axios.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    };
    PostChat.create = function (username, password, isBot) {
        return __awaiter(this, void 0, void 0, function () {
            var apiBaseUri, auth0Audience, auth0Domain, auth0UserConnection, auth0ClientId, authenticationClient, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiBaseUri = 'https://api-bhrsx2hg5q-uc.a.run.app/api/';
                        auth0Audience = 'https://api.getpostchat.com';
                        auth0Domain = 'postchat.us.auth0.com';
                        auth0UserConnection = isBot ? 'bots' : 'Username-Password-Authentication';
                        auth0ClientId = isBot ? 'WHNPXkruRjkmEzWIwXedFJhCOx1x49VR' : 'zT7txf5YZUBjS3iIuZxovfHl5LfcsEBr';
                        authenticationClient = new auth0_1.AuthenticationClient({
                            domain: auth0Domain,
                            clientId: auth0ClientId
                        });
                        return [4 /*yield*/, authenticationClient.passwordGrant({
                                username: username,
                                password: password,
                                // @ts-ignore The library accepts this and processes it, even though it's missing from the type.
                                audience: auth0Audience,
                                realm: auth0UserConnection,
                                scope: 'openid profile'
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new PostChat(response.access_token, apiBaseUri)];
                }
            });
        });
    };
    /** Fetches the current user's available workspaces */
    PostChat.prototype.getWorkspaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, fetchWorkspaceMemberships;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('streams', {
                            params: {
                                'exists[owner]': false
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        fetchWorkspaceMemberships = response.data.map(function (workspace) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = workspace;
                                        return [4 /*yield*/, this.getStreamUsers(workspace.id)];
                                    case 1:
                                        _a.streamUsers = _b.sent();
                                        return [2 /*return*/, workspace];
                                }
                            });
                        }); });
                        return [2 /*return*/, Promise.all(fetchWorkspaceMemberships)];
                }
            });
        });
    };
    /** Fetches child streams of the specified stream */
    PostChat.prototype.getStreamChildren = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('streams', {
                            params: {
                                'owner.id': streamId
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Fetches available threads of a workspaces */
    PostChat.prototype.getThreads = function (workspaceId, direct) {
        return __awaiter(this, void 0, void 0, function () {
            var response, fetchThreadMemberships;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('streams', {
                            params: {
                                'owner.id': workspaceId,
                                'exists.name': !direct
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        fetchThreadMemberships = response.data.map(function (thread) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = thread;
                                        return [4 /*yield*/, this.getStreamUsers(thread.id)];
                                    case 1:
                                        _a.streamUsers = _b.sent();
                                        thread.type = thread.name.length === 0 ? 'direct' : 'global';
                                        return [2 /*return*/, thread];
                                }
                            });
                        }); });
                        return [2 /*return*/, Promise.all(fetchThreadMemberships)];
                }
            });
        });
    };
    /** Fetches threads that the current user is a member of */
    PostChat.prototype.getCurrentUserThreads = function (workspaceId, direct) {
        return __awaiter(this, void 0, void 0, function () {
            var threads;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getThreads(workspaceId, direct)];
                    case 1:
                        threads = _a.sent();
                        return [2 /*return*/, threads.filter(function (thread) { return thread.streamUsers.find(function (value) { return value.user.id === _this.userId; }); })];
                }
            });
        });
    };
    /** Fetches thread by id */
    PostChat.prototype.getThreadById = function (threadId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, thread, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.axios.get('streams/' + threadId)];
                    case 1:
                        response = _b.sent();
                        thread = response.data;
                        _a = thread;
                        return [4 /*yield*/, this.getStreamUsers(threadId)];
                    case 2:
                        _a.streamUsers = _b.sent();
                        thread.type = thread.name.length === 0 ? 'direct' : 'global';
                        return [2 /*return*/, thread];
                }
            });
        });
    };
    PostChat.prototype.createStream = function (ownerId, name, description, discoverable) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.post('streams', {
                            name: name,
                            description: description,
                            discoverable: discoverable,
                            owner: {
                                id: ownerId
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Creates a new thread */
    PostChat.prototype.createThread = function (ownerId, name, description, discoverable) {
        if (description === void 0) { description = ''; }
        if (discoverable === void 0) { discoverable = true; }
        return __awaiter(this, void 0, void 0, function () {
            var createdStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createStream(ownerId, name, description, discoverable)];
                    case 1:
                        createdStream = _a.sent();
                        return [4 /*yield*/, this.joinStream(createdStream.id, this.userId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.getThreadById(createdStream.id)];
                }
            });
        });
    };
    /** Fetches the event stream of a stream */
    PostChat.prototype.getEventStream = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('events', {
                            params: {
                                'stream.id': streamId
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Fetches stream memberships for the specified stream */
    PostChat.prototype.getStreamUsers = function (streamId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get("streams/" + streamId + "/streamUsers", {
                            params: __assign({}, userId && { 'user.id': userId })
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Joins a stream if available */
    PostChat.prototype.joinStream = function (streamId, userId, pusherSubscribe) {
        if (pusherSubscribe === void 0) { pusherSubscribe = true; }
        return __awaiter(this, void 0, void 0, function () {
            var existingMembership, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStreamUsers(streamId, this.userId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (existingMembership) {
                            return [2 /*return*/, existingMembership];
                        }
                        return [4 /*yield*/, this.axios.post('streamUsers', {
                                stream: {
                                    id: streamId
                                },
                                user: {
                                    id: userId
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        if (!pusherSubscribe) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.subscribeWithPusher(response.data.id, [])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Leaves a stream */
    PostChat.prototype.leaveStream = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMembership, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getStreamUsers(streamId, this.userId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (!existingMembership) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.axios.delete('streamUsers/' + existingMembership.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, true];
                    case 4:
                        err_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /** Subscribes to pusher transport */
    PostChat.prototype.subscribeWithPusher = function (streamUserId, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSubscription, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('subscriptions', {
                            params: {
                                'streamUser.id': streamUserId,
                                transport: 'pusher'
                            }
                        })];
                    case 1:
                        existingSubscription = (_a.sent()).data[0];
                        if (existingSubscription) {
                            // TODO: Patch existing types?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [4 /*yield*/, this.axios.post('subscriptions', {
                                streamUser: {
                                    id: streamUserId
                                },
                                transport: 'pusher',
                                eventTypes: eventTypes
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Subscribes to webhook transport */
    PostChat.prototype.subscribeWithWebhook = function (streamUserId, webhookData, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSubscription, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('subscriptions', {
                            params: {
                                'streamUser.id': streamUserId,
                                transport: 'webhook'
                            }
                        })];
                    case 1:
                        existingSubscription = (_a.sent()).data[0];
                        if (existingSubscription) {
                            // TODO: Patch existing types/data?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [4 /*yield*/, this.axios.post('subscriptions', {
                                streamUser: {
                                    id: streamUserId
                                },
                                transport: 'webhook',
                                webhookData: webhookData,
                                eventTypes: eventTypes
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Subscribes to webhook transport with the specified uri */
    PostChat.prototype.subscribeWithWebhookUri = function (streamUserId, webhookUri, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.subscribeWithWebhook(streamUserId, { uri: webhookUri }, eventTypes)];
            });
        });
    };
    /** sends an event to the stream's event stream */
    PostChat.prototype.sendEvent = function (streamId, type, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.post('events', __assign({ stream: {
                                id: streamId
                            }, type: type }, data && data))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Send a message to the specified stream */
    PostChat.prototype.sendMessage = function (streamId, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendEvent(streamId, 'message', {
                        messageEventData: {
                            text: text
                        }
                    })];
            });
        });
    };
    /** Send a typing indication to the specified stream */
    /** Send a typing indication to the specified stream */
    PostChat.prototype.sendTypingEvent = function (streamId, type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendEvent(streamId, type)];
            });
        });
    };
    /** Fetches user information based on the user id */
    PostChat.prototype.getUserInfo = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('users/' + userId)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /** Fetches users available to the current user */
    PostChat.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('users')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return PostChat;
}());
exports.PostChat = PostChat;
//# sourceMappingURL=postChat.js.map