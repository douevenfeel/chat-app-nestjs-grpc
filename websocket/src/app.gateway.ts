import { Logger } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server) {
        this.logger.log('Initialized');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('joinChats')
    joinChats(client: Socket, id: number): void {
        client.join(`chats${id}`);
        console.log(`JOINED CHATS: chats${id}`);
    }

    @SubscribeMessage('leaveChats')
    leaveChats(client: Socket, id: number): void {
        client.leave(`chats${id}`);
        console.log(`LEAVED CHATS: chats${id}`);
    }

    @SubscribeMessage('joinChat')
    joinChat(client: Socket, id: number): void {
        client.join(`chat${id}`);
        console.log(`JOINED CHAT: chat${id}`);
    }

    @SubscribeMessage('leaveChat')
    leaveChat(client: Socket, id: number): void {
        client.leave(`chat${id}`);
        console.log(`LEAVED CHAT: chat${id}`);
    }
}
