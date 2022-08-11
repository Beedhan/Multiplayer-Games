import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';
import { TyperaceModule } from './typerace/typerace.module';

@Module({
  imports: [LobbyModule, TyperaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
