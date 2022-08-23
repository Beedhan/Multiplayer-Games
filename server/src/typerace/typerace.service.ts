import { EndTyperaceDto } from './dto/end-typerace.dto';
import { UpdateProgressTyperaceDto } from './dto/update-progress.dto';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { game_state } from 'src/misc/GameState';
import { UpdateTyperaceDto } from './dto/update-typerace.dto';

const text: string[] = [
  'this is a test quote for my typing game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game.',
  "The water rush down the wash and into the slot canyon below. Two hikers had started the day to sunny weather without a cloud in the sky, but they hadn't thought to check the weather north of the canyon. Huge thunderstorms had brought a deluge o rain and produced flash floods heading their way. The two hikers had no idea what was coming.",
  "Wandering down the path to the pond had become a daily routine. Even when the weather wasn't cooperating like today with the wind and rain, Jerry still took the morning stroll down the path until he reached the pond. Although there didn't seem to be a particular reason Jerry did this to anyone looking in from the outside, those who knew him well knew exactly what was going on. It could all be traced back to a specific incident that happened exactly 5 years previously.",
  "He couldn't move. His head throbbed and spun. He couldn't decide if it was the flu or the drinking last night. It was probably a combination of both.",
  "Sleeping in his car was never the plan but sometimes things don't work out as planned. This had been his life for the last three months and he was just beginning to get used to it. He didn't actually enjoy it, but he had accepted it and come to terms with it. Or at least he thought he had. All that changed when he put the key into the ignition, turned it and the engine didn't make a sound.",
  'Do you really listen when you are talking with someone? I have a friend who listens in an unforgiving way. She actually takes every word you say as being something important and when you have a friend that listens like that, words take on a whole new meaning.',
  'He heard the crack echo in the late afternoon about a mile away. His heart started racing and he bolted into a full sprint. he repeated under his breathlessness as he continued to sprint.',
];

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
    game_state[clientRoom].currentGameConfig = {
      ...game_state[clientRoom].currentGameConfig,
      time: 30,
      running: true,
      words: text[Math.floor(Math.random() * text.length)],
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
