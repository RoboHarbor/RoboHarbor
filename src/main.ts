import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {WsAdapter} from "@nestjs/platform-ws";
import PierWorkerService from "./pierWorker/PierWorkerService";
import {RoboHarborLogger} from "./app.logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    snapshot: process.env.NODE_ENV !== 'production',
    logger: new RoboHarborLogger()
  });
  app.enableCors();
  app.setGlobalPrefix('api')
  app.useWebSocketAdapter(new WsAdapter(app));
  const config = new DocumentBuilder()
      .setTitle('RoboHarbor')
      .setDescription('ROBOHARBOR API description')
      .setVersion('1.0')
      .addTag("ui", "User Interface API")
      .addTag("piers", "Services for all Piers connected")
      .addTag("robots", "Service Endpoint for all Robots")
      .addTag("harbor", "Service Endpoint for all Harbor related services")
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV !== 'production' || process.env.MODULE === 'worker') {
    setTimeout(() => {
      const pierWorker = new PierWorkerService(process.env.PIER_NAME || "first-left");
      pierWorker.startPier();
    }, 2000);


  }

  await app.listen(5001);
}
bootstrap();
