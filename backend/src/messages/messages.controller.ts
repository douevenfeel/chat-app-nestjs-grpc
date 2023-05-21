import {
    Body,
    Controller,
    Get,
    OnModuleInit,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import axios from 'axios';
import { Observable } from 'rxjs';
import {
    GrpcMethod,
    ClientGrpc,
    Client,
    Transport,
} from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc.options';
import { Message } from './messages.model';
import { User } from 'src/users/users.model';

interface ImessageServiceGrpc {
    sendMessage(data: {
        message: Message & {
            createdAt?: string;
        };
        senderChats: { id: number; user: User; message: Message }[];
        receiverChats: { id: number; user: User; message: Message }[];
        senderId: number;
        receiverId: number;
    }): Observable<any>;
}

@ApiTags('Сообщения')
@Controller('messages')
export class MessagesController implements OnModuleInit {
    constructor(private messageService: MessagesService) {}

    @Client(grpcClientOptions) private readonly client: ClientGrpc;
    private grpcService: ImessageServiceGrpc;
    onModuleInit() {
        this.grpcService =
            this.client.getService<ImessageServiceGrpc>('messageServiceGrpc');
    }

    @WebSocketServer() wss: Server;
    @WebSocketServer()
    set server(server: Server) {
        this.wss = server;
    }
    afterInit(server: Server) {
        this.wss = server;
    }

    @ApiOperation({ summary: 'отправка сообщения' })
    @ApiResponse({ status: 200 })
    @Post(':id')
    @UseGuards(JwtAuthGuard)
    async findChat(
        @Param('id') id: number,
        @Req() request: RequestUser,
        @Body() body: { text: string }
    ) {
        const { id: userId } = request.user;
        const data = await this.messageService.createMessage(
            userId,
            +id,
            body.text
        );
        console.log(data.message);
        return this.grpcService.sendMessage({
            ...data,
            senderId: userId,
            receiverId: id,
        });
    }
}
