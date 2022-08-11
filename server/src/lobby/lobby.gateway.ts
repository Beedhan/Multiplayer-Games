import { SelectGameDto } from './dto/select-game.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { LobbyService } from './lobby.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { randomBytes } from 'crypto';
import { Namespace, Server, Socket } from 'socket.io';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces/hooks';

@WebSocketGateway({
  cors: '*',
})
export class LobbyGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private readonly lobbyService: LobbyService) {}
  @WebSocketServer()
  server: Server;

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.lobbyService.disconnection(client, this.server);
  }

  afterInit(): void {
    console.log(`Websocket Gateway initialized.`);
  }

  @SubscribeMessage('createLobby')
  async create(
    @MessageBody() createLobbyDto: CreateLobbyDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomCode = await this.lobbyService.create(createLobbyDto, client);
    return roomCode;
  }

  @SubscribeMessage('joinLobby')
  async join(
    @MessageBody() joinLobbyDto: JoinLobbyDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomSize = await this.server.in(joinLobbyDto.roomCode).fetchSockets();
    if (roomSize.length === 0) {
      return { error: 'Cannot find room' };
    }
    const result = await this.lobbyService.join(
      joinLobbyDto,
      client,
      this.server,
    );
    if (!result) {
      return { error: 'Cannot join the room' };
    }
    return true;
  }

  @SubscribeMessage('findAllLobby')
  async findAll(@ConnectedSocket() client: Socket) {
    const rooms = Array.from(client.rooms);
    return { rooms };
  }
  @SubscribeMessage('getUsers')
  async getUsers(@ConnectedSocket() client: Socket) {
    const connectedRoom = Array.from(client.rooms);
    if (connectedRoom.length < 2) {
      return { room: null };
    }
    const users = await this.server.in(connectedRoom).fetchSockets();
    const connectedUsers = [];
    for (const user of users) {
      connectedUsers.push(user.data.name);
    }
    return connectedUsers;
  }

  @SubscribeMessage('ChangeMode')
  async selectMode(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameName: SelectGameDto,
  ) {
    const data = await this.lobbyService.selectGame(client, gameName);
    return data;
  }
  @SubscribeMessage('GameState')
  async gameState(@ConnectedSocket() client: Socket) {
    const data = await this.lobbyService.gameState(client, this.server);
    return data;
  }
}
