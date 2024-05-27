import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {ApiOperation} from "@nestjs/swagger";
import {SocketService} from "./harbor/socket.service";
import {LogWSService} from "./log/logws.service";
import {Inject} from "@nestjs/common";

@WebSocketGateway(3333, { transports: ['websocket'] })
export class AppLogws implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: any;

  afterInit(server: any): any {
  }

  constructor(
      private readonly socketService: LogWSService) {

  }


  handleConnection(@ConnectedSocket() client: any) {
    this.socketService.handleConnection(client, this.server);
  }


  @ApiOperation({})
  handleDisconnect(@ConnectedSocket() client: any) {
    // Handle disconnection event
  }


}
