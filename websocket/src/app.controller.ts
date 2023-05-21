import { Controller } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GrpcMethod } from '@nestjs/microservices';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    lastSeen: string;
}

export interface Message {
    id: number;
    text: string;
    user: User;
    chatId: number;
    createdAt?: string;
}

interface Chat {
    id: number;
    user: User;
    message: Message;
}

interface Data {
    message: Message;
    senderChats: Chat[];
    receiverChats: Chat[];
    senderId: number;
    receiverId: number;
}

@Controller('messages')
export class MessagesControllerGrpc {
    constructor(private appGateway: AppGateway) {}

    @GrpcMethod('messageServiceGrpc', 'sendMessage')
    sendMessage({
        message,
        senderChats,
        receiverChats,
        senderId,
        receiverId,
    }: Data) {
        console.log('SEND MSG TO CLIENT');
        if (this.appGateway.wss) {
            this.appGateway.wss
                .to(`chat${message.chatId}`)
                .emit('message', message);
            this.appGateway.wss
                .to(`chats${senderId}`)
                .emit('chats', senderChats);
            this.appGateway.wss
                .to(`chats${receiverId}`)
                .emit('chats', receiverChats);
        } else {
            console.log('WebSocket server is not initialized yet');
        }
        return { status: 'ok' };
    }
}
