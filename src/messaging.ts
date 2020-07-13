import {Event, Group, GroupMember, MessageEventData, Subscription} from "./interfaces";
import Axios, {AxiosInstance} from "axios";

export class Messaging {
    private readonly axios: AxiosInstance;
    private readonly userId: string;

    constructor(accessToken: string, userId: string) {
        this.userId = userId;
        this.axios = Axios.create({
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            baseURL: "https://api-bhrsx2hg5q-uc.a.run.app/api/"
        })
    }

    getWorkspaces(): Promise<Group[]> {
        return this.axios.get<Group[]>("groups", {
            params: {
                exists: {
                    owner: false
                }
            }
        }).then((response) => response.data);
    }

    getChannels(workspaceId: string): Promise<Group[]> {
        return this.axios.get<Group[]>("groups", {
            params: {
                owner: {
                    id: workspaceId
                },
                exists: {
                    name: true
                }
            }
        }).then((response) => response.data);
    }

    getDirectGroups(workspaceId: string): Promise<Group[]> {
        return this.axios.get<Group[]>("groups", {
            params: {
                owner: {
                    id: workspaceId
                },
                exists: {
                    name: false
                }
            }
        }).then((response) => response.data);
    }

    getEventStream(groupId: string): Promise<Event[]> {
        return this.axios.get<Event[]>("events", {
            params: {
                eventGroup: {
                    id: groupId
                }
            }
        }).then((response) => response.data);
    }

    getGroupMemberships(selfOnly: boolean, groupId?: string): Promise<GroupMember[]> {
        let params: GroupMember = {};

        if(groupId) {
            params["userGroup"] = {
                id: groupId
            };
        }
        if(selfOnly) {
            params["user"] = {
                id: this.userId
            }
        }
        return this.axios.get<GroupMember[]>("groupMember", {
            params: params
        }).then((response) => response.data);
    }

    async joinGroup(groupId: string): Promise<GroupMember> {
        const [existingMembership] = await this.getGroupMemberships(true, groupId);
        if(existingMembership) {
            return existingMembership;
        }

        return this.axios.post<Event>("groupMember", {
            userGroup: {
                id: groupId
            },
            user: {
                id: this.userId
            }
        }).then((response) => response.data);
    }

    async leaveGroup(groupId: string): Promise<void> {
        const [existingMembership] = await this.getGroupMemberships(true, groupId);
        if(existingMembership) {
            await this.axios.delete("groupMembership/" + existingMembership.id);
        }

        return Promise.resolve();
    }

    async subscribeToGroupWithPusher(groupMemberId: string, eventTypes?: string[]): Promise<Subscription> {
        const [existingSubscription]: Subscription[] = await this.axios.get<Subscription[]>("subscriptions", {
            params: {
                groupMember: {
                    id: groupMemberId
                },
                transport: "pusher"
            }
        }).then((response) => response.data);

        if(existingSubscription) {
            //TODO: Patch existing types?
            return existingSubscription;
        }

        return this.axios.post<Subscription>("subscriptions", {
            groupMember: {
                id: groupMemberId
            },
            transport: "pusher",
            eventTypes: eventTypes
        }).then((response) => response.data);
    }

    sendMessage(groupId: string, messageData: MessageEventData): Promise<Event> {
        return this.axios.post<Event>("events", {
            eventGroup: {
                id: groupId
            },
            type: "message",
            messageEventData: messageData
        }).then((response) => response.data);
    }

    sendTextMessage(groupId: string, text: string): Promise<Event> {
        return this.sendMessage(groupId, {text: text});
    }
}