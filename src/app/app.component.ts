import {Component, Sanitizer} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import axios from "axios";
import {Img} from "./img";

export const customAxios = axios.create({
  baseURL: 'https://localhost:7081/WeatherForecast/',
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {

  constructor() {
  }

  image: any;
  image2: any;
  inputId: number = 0


  onFileSelected(event: Event) {

    // @ts-ignore
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      this.image = reader.result;
      console.log(reader.result)
      let s = reader.result;
      let dto = {
        data: reader.result
      }
      // @ts-ignore
      this.postImage(dto)
    }

    if (file) {
      reader.readAsDataURL(file)
    }

  }

  async postImage(dto: { data: string | ArrayBuffer }) {
    let response = await customAxios.post("saveImg", dto)
    return response.data;
  }

  async getImage(id: number): Promise<Img> {
    console.log("getting id: " + this.inputId)
    let response = await customAxios.get<Img>("getSingleImg/"+id)
    console.log(response.data)
    return response.data;
  }

  async searchImg() {
    let result = this.getImage(this.inputId)
   let img:Img = await result;
    this.image2 = img.data;
  }
}

