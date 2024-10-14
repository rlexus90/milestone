import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './core/pages/registration/registration.component';
import { LoginComponent } from './core/pages/login/login.component';
import { HeaderComponent } from './core/component/header/header.component';
import { FooterComponent } from './core/component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './core/pages/main/main.component';
import { StoreModule } from '@ngrx/store';
import { ProfileComponent } from './core/pages/profile/profile.component';
import { GlobalElement } from './core/services/global';
import { GroupItemComponent } from './shared/component/groupItem/groupItem.component';
import { DialogGreateGroupComponent } from './shared/component/dialog-greate-group/dialog-greate-group.component';
import { GroupDialogComponent } from './core/pages/group-dialog/group-dialog.component';
import { MessageComponent } from './shared/component/message/message.component';
import { ConversationComponent } from './core/pages/conversation/conversation.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    ProfileComponent,
    GroupItemComponent,
    DialogGreateGroupComponent,
    NotFoundComponent,
    GroupDialogComponent,
    MessageComponent,
    ConversationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [GlobalElement],
  bootstrap: [AppComponent],
})
export class AppModule {}
