import React, { Component } from 'react';
import axios from 'axios'

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import AlertInfo from '../../component/AlertInfo';



export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: "",
            variant: "",
            alertShow: false,
            modalShow: false,
            imageUri: "",
            showImage: false,
            showImageCapture: false,
        }
    }

    handleTakePhoto = (dataUri) => {
        this.setState({ showImageCapture: false, showImage: true, imageUri: dataUri })
    }

    handleCameraError = (error) => {
        this.setState({ alertShow: false, error: "", variant: "danger" })

        if (error.toString() == "NotAllowedError: Permission denied") {
            this.setState({ alertShow: true, error: "Sem permissão para acessar câmera.", variant: "danger", modalShow: false, showImageCapture: false, showImage: false })
            console.log(error)
        } else {
            this.setState({ alertShow: true, error: "Erro inesperado ao localizar câmera. Verifique se possui permissão.", variant: "danger", modalShow: false, showImageCapture: false, showImage: false })
        }
    }


    fileToDataUri = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.setState({imageUri:event.target.result})
            this.save()
        };
         reader.readAsDataURL(file);
  
    }


    save = () => {
        this.setState({ alertShow: false, error: "", variant: "danger" })
        var token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzd2FnZ2VyIiwiZXhwIjozNDE1NDM0ODEzLCJpYXQiOjE2MTU0MzQ4MzF9.mjIu6knISGWWu9uq5IWmWlAoiiOxRAofZQZFBYPuCsL5ULyjbhZRzjulIiSOCA3YCIantPl64_XBbxKaDs9DUA'
        const blob = this.dataURItoBlob(this.state.imageUri)
        console.log(blob)
        const bodyFormData = new FormData()
        bodyFormData.append('file', blob)
        console.log(bodyFormData)
        return axios({
            method: 'POST',
            url: `http://localhost:8080/import-mailing-file/import-file`,
            data: bodyFormData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
                Accept: `application/json`
            },
        })

        // this.setState({ modalShow: false, showImageCapture: false, showImage: false })
    }



    dataURItoBlob = (dataURI) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1])
        else byteString = unescape(dataURI.split(',')[1])

        // separate out the mime component
        var mimeString = dataURI
            .split(',')[0]
            .split(':')[1]
            .split(';')[0]

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length)
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ia], { type: mimeString })
    }


    render() {
        return (
            <div className="App">
                {this.state.alertShow && <AlertInfo description={this.state.error} variant={this.state.variant} alertShow={this.state.alertShow} />}

                <Button onClick={() => this.setState({ showImageCapture: true, modalShow: true })}>capturar imagem</Button>






                <div>
                    <img width="200" height="200" src={this.state.imageUri} alt="avatar" />
                    <input type="file" onChange={(event) => this.fileToDataUri(event.target.files[0])} />
                </div>




















                <Modal
                    show={this.state.modalShow}
                    onHide={() => this.setState({ modalShow: false, showImageCapture: true, showImage: false })}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered  >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Capturar imagem
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.showImageCapture &&
                            <Camera onTakePhoto={(dataUri) => this.handleTakePhoto(dataUri)}
                                isDisplayStartCameraError={false}
                                isImageMirror={true}
                                isSilentMode={false}
                                isMaxResolution={true}
                                onCameraError={(error) => this.handleCameraError(error)} />}
                        {this.state.showImage &&
                            <div>
                                <img src={this.state.imageUri} style={{ width: "100%" }}></img>
                            </div>
                        }
                    </Modal.Body>
                    {this.state.showImage &&
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => this.setState({ showImageCapture: true, showImage: false })}>Descartar</Button>
                            <Button variant="success" onClick={() => this.save()}>salvar</Button>
                        </Modal.Footer>
                    }
                </Modal>

            </div>
        )
    }
}