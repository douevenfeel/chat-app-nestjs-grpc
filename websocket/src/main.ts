import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { grpcClientOptions } from './grpc.options';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.connectMicroservice(grpcClientOptions);
    app.enableCors({ origin: 'http://localhost:3000' });
    await app.listen(5001, () =>
        console.log(`Server started on port = ${5001}`)
    );
    await app.startAllMicroservices();
}
bootstrap();
