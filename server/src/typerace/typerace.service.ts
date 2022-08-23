import { EndTyperaceDto } from './dto/end-typerace.dto';
import { UpdateProgressTyperaceDto } from './dto/update-progress.dto';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { game_state } from 'src/misc/GameState';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomWords = require('random-words');

@Injectable()
export class TyperaceService {
  ready(@ConnectedSocket() client: Socket, server: Server) {
    const clientRoom = client.data.room;
    const currentRoom = game_state[clientRoom];

    const indexOfPlayer = currentRoom.currentGameConfig.playersState.findIndex(
      (val) => {
        return Object.keys(val)[0] === client.id;
      },
    );
    currentRoom.currentGameConfig.playersState[indexOfPlayer][client.id] = {
      name: client.data.name,
      state: true,
    };
    server.in(clientRoom).emit('typerace_states', {
      msg: game_state[clientRoom].currentGameConfig.playersState,
    });
    const allReady = game_state[
      clientRoom
    ].currentGameConfig.playersState.every(
      (e) => Object.values(e)[0].state === true,
    );

    if (allReady) {
      this.start(client, server);
    }

    return true;
  }

  start(@ConnectedSocket() client: Socket, server: Server) {
    const clientRoom = client.data.room;
    const words = randomWords({ join: ' ', min: 10, max: 20 });
    game_state[clientRoom].currentGameConfig = {
      ...game_state[clientRoom].currentGameConfig,
      time: 30,
      running: true,
      words,
    };
    server.in(clientRoom).emit('typerace_config', {
      msg: game_state[clientRoom],
    });
    setTimeout(() => {
      game_state[clientRoom].currentGameConfig = {
        ...game_state[clientRoom].currentGameConfig,
        running: false,
      };
      console.log(
        'race ended',
        JSON.stringify(game_state[clientRoom].currentGameConfig.playersState),
      ),
        server.in(clientRoom).emit('typerace_end');
    }, game_state[clientRoom].currentGameConfig.time * 1000 + 1000);
    return true;
  }

  players_state(@ConnectedSocket() client: Socket): any {
    const clientRoom = client.data.room;
    return game_state[clientRoom].currentGameConfig.playersState;
  }

  end(
    @ConnectedSocket() client: Socket,
    server: Server,
    stats: EndTyperaceDto,
  ) {
    const clientRoom = client.data.room;
    const currentRoom = game_state[clientRoom];
    const indexOfPlayer = currentRoom.currentGameConfig.playersState.findIndex(
      (val) => {
        return Object.keys(val)[0] === client.id;
      },
    );
    if (
      currentRoom.currentGameConfig.playersState[indexOfPlayer][client.id]
        .state !== false
    ) {
      currentRoom.currentGameConfig.playersState[indexOfPlayer][client.id] = {
        ...currentRoom.currentGameConfig.playersState[indexOfPlayer][client.id],
        state: false,
        typeGameStats: { accuracy: stats.stats.accuracy, wpm: stats.stats.wpm },
      };
    }
    const allReady = game_state[
      clientRoom
    ].currentGameConfig.playersState.every((e) =>
      Object.values(e)[0].typeGameStats ? true : false,
    );

    if (allReady) {
      // server.in(clientRoom).emit('typestats_ready', {
      //   msg: currentRoom.currentGameConfig.playersState,
      // });
      server.in(clientRoom).emit('typerace_states', {
        msg: game_state[clientRoom].currentGameConfig.playersState,
      });
    }
    console.log(
      JSON.stringify(currentRoom.currentGameConfig.playersState),
      'allstatsready',
    );

    return true;
  }

  updateProgress(
    @ConnectedSocket() client: Socket,
    server: Server,
    updateProgressTyperaceDto: UpdateProgressTyperaceDto,
  ) {
    const clientRoom = client.data.room;
    server.in(clientRoom).emit('typerace_progress', {
      id: client.id,
      progress: updateProgressTyperaceDto.progress,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} typerace`;
  }
}
