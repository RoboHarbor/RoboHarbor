import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  const config = new DocumentBuilder()
      .setTitle('RoboHarbor')
      .setDescription('ROBOHARBOR API description')
      .setVersion('1.0')
      .addTag("ui", "User Interface API")
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(5001);
}
bootstrap();
