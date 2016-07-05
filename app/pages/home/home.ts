import {App, Page, Platform} from 'ionic-angular';
import {Camera, Transfer} from 'ionic-native';
import {Http, Headers, RequestOptions} from '../../../node_modules/angular2/http';
import {Inject} from '../../../node_modules/angular2/core';
import 'rxjs/add/operator/map';

@Page({
    templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

    navigator: any;
    camera: any;
    http: any;
    platform: any;
    BlobBuilder: any;
    fileTransfer:any;


    constructor(httpService: Http) {
        console.log(Camera);
        this.http = httpService;
        this.fileTransfer = new Transfer();

    }

    scan() {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            quality: 75,
            allowEdit: false,
            saveToPhotoAlbum: false
        };

        Camera.getPicture(options).then((imageData) => {
            let base64Image = "data:image/jpeg;base64," + imageData;
            this.cameraSuccessCallback(imageData);

        }, (err) => {
            alert(err);
        });
    };

    cameraSuccessCallback(imageData) {
        console.log('called camera success callback');

        let image = document.getElementsByTagName('img')[0];
        image.src = "data:image/jpeg;base64," + imageData;

        let filesToUpload = [];

        filesToUpload.push(
          new File([imageData], "image.jpeg")
        );
        //
        // // Post image data to server
        // this.makeFileRequest('http://172.18.84.129:9281/upload'
        //   ,[]
        //   ,filesToUpload).then(function(res){
        //     console.log(res);
        //   });
        let headers = {'AuthKey':'12c6ae2b1dfd16038fc2'};

        this.fileTransfer.upload(
            imageData,
            'https://api.pastec.io/indexes/vygfzrfgnqjwmmzzcvae/searcher',
            {headers:headers}
          ).subscribe(
             res => console.log(res),
             error =>  console.log(error));
    };

    getApi(imageData) {
        console.log('called getapi');

        // let headers = new Headers({
        //     'AuthKey': '12c6ae2b1dfd16038fc2'
        // });
        //
        // let options = new RequestOptions({ headers: headers });
        //
        // let body = JSON.stringify({ imageData });
        //
        // return this.http.post(
        //     "https://api.pastec.io/indexes/vygfzrfgnqjwmmzzcvae/searcher",
        //     body,
        //     options).map(res => res.json());

    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }




};
