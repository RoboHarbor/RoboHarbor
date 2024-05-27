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

@WebSocketGateway({ transports: ['websocket'] })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: any;

  afterInit(server: any): any {
  }

  constructor(private readonly socketService: SocketService) {

  }


  handleConnection(@ConnectedSocket() client: any) {
    this.socketService.handleConnection(client, this.server);
  }


  @ApiOperation({})
  handleDisconnect(@ConnectedSocket() client: any) {
    // Handle disconnection event
    this.socketService.handleDisconnect(client, this.server);
  }


}
