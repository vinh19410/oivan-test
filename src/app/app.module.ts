import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';

//spinner
import { NgxSpinnerModule } from 'ngx-spinner';

//optimse image
import { CLOUDINARY_CONFIG, NgxPictureModule } from 'ngx-picture';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

//material module
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { ExcerptFilter } from './pipe/excerpt.filter';
import { LazyImgDirective } from './pipe/lazyimage.directive';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    PostComponent,
    ExcerptFilter,
    LazyImgDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    //pipe

    //spinner
    NgxSpinnerModule,

    //optimse image
    NgxPictureModule.forRoot(CLOUDINARY_CONFIG),

    //material
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,

    GraphQLModule,
    HttpClientModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
