"use strict";
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
exports.Messaging = void 0;
var axios_1 = __importDefault(require("axios"));
var auth0_1 = require("auth0");
var Messaging = /** @class */ (function () {
    function Messaging(accessToken, userId, baseUrl) {
        this.userId = userId;
        this.axios = axios_1.default.create({
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            baseURL: baseUrl
        });
    }
    Messaging.create = function (isBot, username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var apiBaseUri, auth0Audience, auth0Domain, auth0UserConnection, auth0ClientId, authenticationClient, response, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiBaseUri = "https://api-bhrsx2hg5q-uc.a.run.app/api/";
                        auth0Audience = "https://api.getpostchat.com";
                        auth0Domain = "postchat.us.auth0.com";
                        auth0UserConnection = isBot ? "bots" : "Username-Password-Authentication";
                        auth0ClientId = isBot ? "WHNPXkruRjkmEzWIwXedFJhCOx1x49VR" : "zT7txf5YZUBjS3iIuZxovfHl5LfcsEBr";
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
                                scope: "openid"
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, authenticationClient.getProfile(response.access_token)];
                    case 2:
                        profile = _a.sent();
                        return [2 /*return*/, new Messaging(response.access_token, profile.sub, apiBaseUri)];
                }
            });
        });
    };
    Messaging.prototype.getWorkspaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('groups', {
                            params: {
                                'exists[owner]': false
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.getChannels = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('groups', {
                            params: {
                                owner: {
                                    id: workspaceId
                                },
                                exists: {
                                    name: true
                                }
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.getDirectGroups = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('groups', {
                            params: {
                                owner: {
                                    id: workspaceId
                                },
                                exists: {
                                    name: false
                                }
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.getEventStream = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('events', {
                            params: {
                                eventGroup: {
                                    id: groupId
                                }
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.getGroupMemberships = function (selfOnly, groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        if (groupId) {
                            params['userGroup'] = {
                                id: groupId
                            };
                        }
                        if (selfOnly) {
                            params['user'] = {
                                id: this.userId
                            };
                        }
                        return [4 /*yield*/, this.axios.get('groupMember', {
                                params: params
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.joinGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMembership, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupMemberships(true, groupId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (existingMembership) {
                            return [2 /*return*/, existingMembership];
                        }
                        return [4 /*yield*/, this.axios.post('groupMember', {
                                userGroup: {
                                    id: groupId
                                },
                                user: {
                                    id: this.userId
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.leaveGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMembership;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupMemberships(true, groupId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (!existingMembership) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.axios.delete('groupMembership/' + existingMembership.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Messaging.prototype.subscribeWithPusher = function (groupMemberId, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSubscription, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('subscriptions', {
                            params: {
                                groupMember: {
                                    id: groupMemberId
                                },
                                transport: 'pusher'
                            }
                        })];
                    case 1:
                        existingSubscription = (_a.sent()).data[0];
                        if (existingSubscription) {
                            //TODO: Patch existing types?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [4 /*yield*/, this.axios.post('subscriptions', {
                                groupMember: {
                                    id: groupMemberId
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
    Messaging.prototype.subscribeWithWebhook = function (groupMemberId, webhookData, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSubscription, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get('subscriptions', {
                            params: {
                                groupMember: {
                                    id: groupMemberId
                                },
                                transport: 'webhook'
                            }
                        })];
                    case 1:
                        existingSubscription = (_a.sent()).data[0];
                        if (existingSubscription) {
                            //TODO: Patch existing types/data?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [4 /*yield*/, this.axios.post('subscriptions', {
                                groupMember: {
                                    id: groupMemberId
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
    Messaging.prototype.sendMessage = function (groupId, messageData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.post('events', {
                            eventGroup: {
                                id: groupId
                            },
                            type: 'message',
                            messageEventData: messageData
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.sendTextMessage = function (groupId, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendMessage(groupId, { text: text })];
            });
        });
    };
    Messaging.prototype.startTyping = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.post('events', {
                            eventGroup: {
                                id: groupId
                            },
                            type: 'typing-start',
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Messaging.prototype.stopTyping = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.post('events', {
                            eventGroup: {
                                id: groupId
                            },
                            type: 'typing-stop',
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return Messaging;
}());
exports.Messaging = Messaging;
//# sourceMappingURL=messaging.js.map