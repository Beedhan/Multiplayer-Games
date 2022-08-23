import { EndTyperaceDto } from './dto/end-typerace.dto';
import { UpdateProgressTyperaceDto } from './dto/update-progress.dto';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { TyperaceService } from './typerace.service';
import { CreateTyperaceDto } from './dto/create-typerace.dto';
import { UpdateTyperaceDto } from './dto/update-typerace.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: '*:*',
})
export class TyperaceGateway {
  constructor(private readonly typeraceService: TyperaceService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('typerace_ready')
  usersReady(@ConnectedSocket() client: Socket) {
    return this.typeraceService.ready(client, this.server);
  }

  @SubscribeMessage('typerace_playersState')
  readyState(@ConnectedSocket() client: Socket) {
    return this.typeraceService.players_state(client);
  }

  @SubscribeMessage('typerace_end')
  remove(
    @ConnectedSocket() client: Socket,
    @MessageBody() stats: EndTyperaceDto,
  ) {
    return this.typeraceService.end(client, this.server, stats);
  }
  @SubscribeMessage('typerace_progress')
  updateProgress(
    @ConnectedSocket() client: Socket,
    @MessageBody() progress: UpdateProgressTyperaceDto,
  ) {
    return this.typeraceService.updateProgress(client, this.server, progress);
  }
}
