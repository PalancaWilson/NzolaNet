import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-post',
  imports: [
    FormsModule
  ],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {

   text:string = '';

  limit:number = 280;
}






 
