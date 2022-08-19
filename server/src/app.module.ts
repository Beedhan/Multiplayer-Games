import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';
import { TyperaceModule } from './typerace/typerace.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [LobbyModule, TyperaceModule, HealthcheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
