import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { MessagesControllerGrpc } from './app.controller';


@Module({
  imports: [],
  controllers: [MessagesControllerGrpc],
  providers: [AppGateway],
})
export class AppModule {}
