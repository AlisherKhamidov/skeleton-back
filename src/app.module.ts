import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddBearerPrefixMiddleware } from './common/middlewares/add-bearer-prefix.middleware';
import { ProductsModule } from './products/products.module';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    JwtService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddBearerPrefixMiddleware, AuthMiddleware).forRoutes('*'); // Apply middleware globally
    // Or apply middleware for specific routes
    // consumer.apply(AddBearerPrefixMiddleware).forRoutes('protected');
  }
}
