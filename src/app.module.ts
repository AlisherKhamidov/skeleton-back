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
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddBearerPrefixMiddleware).forRoutes('*'); // Apply middleware globally
    // Or apply middleware for specific routes
    // consumer.apply(AddBearerPrefixMiddleware).forRoutes('protected');
  }
}
