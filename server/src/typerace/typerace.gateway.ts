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
  cors: '*',
})
export class TyperaceGateway {
  constructor(private readonly typeraceService: TyperaceService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('typerace_ready')
  usersReady(@ConnectedSocket() client: Socket) {
    return this.typeraceService.ready(client, this.server);
  }

  @SubscribeMessage('typerace_end')
  endrace() {
    return this.typeraceService.findOne();
  }

  @SubscribeMessage('typerace_readyState')
  readyState(@ConnectedSocket() client: Socket) {
    return this.typeraceService.ready_state(client);
  }

  @SubscribeMessage('updateTyperace')
  update(@MessageBody() updateTyperaceDto: UpdateTyperaceDto) {
    // return this.typeraceService.update(updateTyperaceDto.id, updateTyperaceDto);
  }

  @SubscribeMessage('removeTyperace')
  remove(@MessageBody() id: number) {
    return this.typeraceService.remove(id);
  }
  @SubscribeMessage('typerace_progress')
  updateProgress(
    @ConnectedSocket() client: Socket,
    @MessageBody() progress: UpdateProgressTyperaceDto,
  ) {
    return this.typeraceService.updateProgress(client, this.server, progress);
  }
}
