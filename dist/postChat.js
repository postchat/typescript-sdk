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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostChat = void 0;
var client_1 = require("./api/client");
/**
 * A messaging client focused interface on the postchat api.
 */
var PostChat = /** @class */ (function () {
    function PostChat(client) {
        this.client = client;
    }
    PostChat.prototype.refreshToken = function (accessToken) {
        this.client.refreshToken(accessToken);
    };
    PostChat.create = function (username, password, isBot) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = PostChat.bind;
                        return [4 /*yield*/, client_1.Client.create(username, password, isBot)];
                    case 1: return [2 /*return*/, new (_a.apply(PostChat, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    /** Fetches the current user's available workspaces, including users as most use-cases require them. */
    PostChat.prototype.getRootStreamsWithUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var streams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getRootStreams()];
                    case 1:
                        streams = _a.sent();
                        return [2 /*return*/, this.retrieveStreamUsersForStreams(streams)];
                }
            });
        });
    };
    PostChat.prototype.getStreamsByParentWithUsers = function (parentStreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var streams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getStreamsByParent(parentStreamId)];
                    case 1:
                        streams = _a.sent();
                        return [2 /*return*/, this.retrieveStreamUsersForStreams(streams)];
                }
            });
        });
    };
    PostChat.prototype.retrieveStreamUsersForStreams = function (streams) {
        return __awaiter(this, void 0, void 0, function () {
            var streamsWithStreamUsers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, streams.map(function (stream) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = [stream];
                                        return [4 /*yield*/, this.client.getStreamUsers(stream.id)];
                                    case 1: return [2 /*return*/, _a.concat([_b.sent()])];
                                }
                            });
                        }); })];
                    case 1:
                        streamsWithStreamUsers = _a.sent();
                        return [2 /*return*/, Promise.all(streamsWithStreamUsers)];
                }
            });
        });
    };
    /** Fetches threads that the current user is a member of */
    PostChat.prototype.getCurrentUserStreamsByParent = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var streams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStreamsByParentWithUsers(workspaceId)];
                    case 1:
                        streams = _a.sent();
                        return [2 /*return*/, streams.filter(function (streamWithStreamUsers) {
                                return streamWithStreamUsers[1].find(function (value) { return value.user.id === _this.client.userId; });
                            })];
                }
            });
        });
    };
    /** Joins a stream if available */
    PostChat.prototype.joinStream = function (streamId, userId, pusherSubscribe) {
        if (pusherSubscribe === void 0) { pusherSubscribe = true; }
        return __awaiter(this, void 0, void 0, function () {
            var existingMembership, newStreamUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getStreamUsers(streamId, this.client.userId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (existingMembership) {
                            return [2 /*return*/, existingMembership];
                        }
                        return [4 /*yield*/, this.client.createStreamUser(streamId, userId)];
                    case 2:
                        newStreamUser = _a.sent();
                        if (!pusherSubscribe) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.subscribeWithPusher(newStreamUser.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, newStreamUser];
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
                        return [4 /*yield*/, this.client.getStreamUsers(streamId, this.client.userId)];
                    case 1:
                        existingMembership = (_a.sent())[0];
                        if (!existingMembership) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.deleteStreamUser(existingMembership.id)];
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
            var existingSubscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getSubscriptions(streamUserId, 'pusher')];
                    case 1:
                        existingSubscription = (_a.sent())[0];
                        if (existingSubscription) {
                            // TODO: Patch existing types?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [2 /*return*/, this.client.createSubscription(streamUserId, 'pusher', eventTypes)];
                }
            });
        });
    };
    /** Subscribes to webhook transport */
    PostChat.prototype.subscribeWithWebhook = function (streamUserId, webhookUri, eventTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSubscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getSubscriptions(streamUserId, 'webhhok')];
                    case 1:
                        existingSubscription = (_a.sent())[0];
                        if (existingSubscription) {
                            // TODO: Patch existing types/data?
                            return [2 /*return*/, existingSubscription];
                        }
                        return [2 /*return*/, this.client.createWebhookSubscription(streamUserId, webhookUri, eventTypes)];
                }
            });
        });
    };
    return PostChat;
}());
exports.PostChat = PostChat;
//# sourceMappingURL=postChat.js.map