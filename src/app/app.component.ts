import {Component, Sanitizer} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import axios from "axios";
import {Img} from "./img";
import {Pdf} from "./pdf";

export const customAxios = axios.create({
  baseURL: 'https://localhost:7081/WeatherForecast/',
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {

  constructor(private sanitizer: DomSanitizer) {
  }

  image: any;
  image2: any;
  inputId: number = 0
  inputPDFid: number = 0;



  onFileSelectedImage(event: Event) {

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
    let response = await customAxios.get<Img>("getSingleImg/" + id)
    console.log(response.data)
    return response.data;
  }

  async searchImg() {
    let result = this.getImage(this.inputId)
    let img: Img = await result;
    this.image2 = img.data;
  }

  onFileSelectedPdf($event: Event) {
    // @ts-ignore
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      console.log(reader.result)
      let dto = {
        data: reader.result
      }
      // @ts-ignore
      this.postPdf(dto)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  private async postPdf(dto: { data: string | ArrayBuffer }) {
    let response = await customAxios.post("savePdf", dto)
    return response.data;
  }

  private async getSinglePdf(id: number): Promise<Pdf> {
    console.log("getting id: " + this.inputPDFid)
    let response = await customAxios.get<Pdf>("getSinglePdf/" + id)

    return response.data;
  }

  public downloadBtn() {

    this.getSinglePdf(this.inputPDFid).then((value) => {



      let blob = new Blob([value.data], {type: 'application/pdf'})
      let fileURL = URL.createObjectURL(blob);
      let safe = this.sanitizer.bypassSecurityTrustUrl(fileURL);
      // @ts-ignore
      window.open(safe);





/*
      const newBlob = new Blob([value.data], {type: 'application/pdf'});
      const downloadLink = document.createElement('a');
      downloadLink.target = '_self';
      const fileName = 'pdf_file.pdf';
      const data = window.URL.createObjectURL(newBlob);
     // this.sanitizer.bypassSecurityTrustUrl(data)
      downloadLink.href = data;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();

 */




    })
  }

}

