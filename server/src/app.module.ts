import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';

@Module({
  imports: [LobbyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
