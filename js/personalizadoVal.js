import { obtenerUsuarioSesion } from './carritoCanasta.js';


let form = document.getElementById('formPersonalizado');
let nombre = document.getElementById("nombre");
let telefono = document.getElementById('tel');
let correo = document.getElementById('correo');
let tam = document.getElementById('tam');
let artesano = document.getElementById('artesanos');
let mensaje = document.getElementById('mensaje');

let alertDiv = document.getElementById('alerta');
let imagen = document.getElementById('product_img');

let erroneo = false;


if (window.location.href == 'http://127.0.0.1:5502/pages/personalizado.html') {
// let pedidosBD = [];
// localStorage.setItem("pedidosBD", JSON.stringify(pedidosBD));  
form.addEventListener('submit', formValidation);
}


function formValidation(e){
    e.preventDefault();
       
    let valido = false;
    let alerta = "";
    alertDiv.innerHTML = "";

    let regexpNombre = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    let regexpTel =/^[0-9]*$/
    let regexpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!regexpNombre.test(nombre.value) || nombre.value.length <= 2 || nombre.value.length == 0 || nombre.value.length > 20){
        alerta += `<h3>¡Nombre no válido!</h3> <br>`;
        valido = true;
    }//validaciónNombre
    
    if(!regexpTel.test(telefono.value)  || telefono.value.length < 10 || telefono.value.length >= 12){
        alerta += `<h3>¡Número no válido! </h3><br>`;
        valido = true;
    }//validaciónTeléfono

    if(!regexpEmail.test(correo.value) || correo.value.length == 0 || correo.value.length >= 200){
        alerta += `<h3>¡Correo electrónico no válido!</h3> <br>`;
        valido = true;
    }//validaciónCorreoElectrónico

    if(tam.value == 'Tamaño'){
        alerta += `<h3>¡Selecciona un tamaño!</h3> <br>`;
        valido = true;
    }//validaciónTamaño

    if(artesano.value == 'Selecciona'){
        alerta += `<h3>¡Selecciona un artesan@!</h3> <br>`;
        valido = true;
    }//validaciónArtesano
   
   
    if(valido){
        alertDiv.innerHTML += `
        <div class="alert alert-danger" role="alert">
            ${alerta}
        </div>`;
        
    }

    if(!valido){
      

        if(!erroneo){
            alertDiv.innerHTML += `
            <div class="alert alert-success" role="alert">
                <h3> ¡Selecciona una imagen y enviar! </h3>
            </div>`;
        }

        document.getElementById('upload_widget').disabled = false;
        nombre.disabled = true;
        telefono.disabled = true;
        correo.disabled  = true; 
        tam.disabled  = true;
        artesano.disabled  = true;

        document.getElementById('enviarPersonalizdo').innerHTML = 'Enviar';

        let myWidget = cloudinary.createUploadWidget({
            
            cloudName: 'nav-attar',
            uploadPreset: 'navAttar'
    
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                imagen.src = result.info.secure_url;
                // url = result.info.secure_url;
                erroneo = true;
                imagen.style.display = 'block';
            }})

        document.getElementById("upload_widget").addEventListener("click", function(){
            myWidget.open();
          }, false);
            
        if(imagen.src == "http://127.0.0.1:5500/pages/perzonalizado.html"){
            alertDiv.innerHTML = `<div class="alert alert-success" role="alert">
                                    <h3> ¡Selecciona una imagen y enviar! </h3>
                                  </div>`;
                                  
        }else if(erroneo){
            let usuario = obtenerUsuarioSesion();

            if(usuario.length != 0){
                guardarPedido(usuario,nombre,telefono,correo,tam,artesano,mensaje,imagen.src)
            }

            enviarCorreo(nombre,telefono,correo,tam,artesano,mensaje,imagen.src)
            
        }
   
    }


}


function guardarPedido(usuario,nombre,telefono,correo,tam,artesano,mensaje,url){
   
    let datosPedido = {
        'nombre': nombre.value,
        'telefono': telefono.value,
        'correo':correo.value,
        'tam': tam.value,
        'artesano': artesano.value,
        'mensaje': mensaje.value,
        'url' : url

    }

    let misPedidos = obtenerMisPedidos(usuario.id);
  
    if (Object.keys(misPedidos).length === 0){

        let nuevoPedido = {
            'idUsuario' : usuario.id,
            'pedidos' : []
        }

        nuevoPedido.pedidos.push(datosPedido);
        agregarPedidoBD(nuevoPedido);
       
    }
    else{
      
        misPedidos.pedidos.push(datosPedido)
        
        actualizarPedidosBD(misPedidos);
    }

}

function obtenerMisPedidos(idUsuario){
    let objetosJSON = localStorage.getItem("pedidosBD");      
    let pedidosBD = JSON.parse(objetosJSON);
    let tusPedidos = {};

    pedidosBD.forEach(function(pedidoUsu) {
        if(pedidoUsu.idUsuario == idUsuario){
            tusPedidos = pedidoUsu;
        }
    });

    return tusPedidos;

}


function agregarPedidoBD(nuevoPedido){
    let objetosJSON = localStorage.getItem("pedidosBD");      
    let pedidosBD = JSON.parse(objetosJSON);

    pedidosBD.push(nuevoPedido);

    localStorage.setItem("pedidosBD", JSON.stringify(pedidosBD));
}


function actualizarPedidosBD(misPedidos){
    let objetosJSON = localStorage.getItem("pedidosBD");      
    let pedidosBD = JSON.parse(objetosJSON);

   

    pedidosBD.forEach(function(pedidoUu){
        
        if(pedidoUu.idUsuario == misPedidos.idUsuario){
            pedidoUu.pedidos = misPedidos.pedidos;
            localStorage.setItem("pedidosBD", JSON.stringify(pedidosBD));
        }
    })

}


function enviarCorreo(nombre,telefono,correo,tam,artesano,mensaje,url){
    var dir = document.createElement("a");
    dir.href = `mailto:nav.attar.contact@gmail.com?Subject=Cotización para : ${nombre.value} 
        &body=Cliente: ${nombre.value}%20%0D%0A %20%0D%0A ${mensaje.value} %20%0D%0A%20%0D%0ACorreo : ${correo.value} %20%0D%0ATeléfono: ${telefono.value}%20%0D%0ATamaño: ${tam.value} [cm]%20%0D%0A %20%0D%0A Artesan@: ${artesano.value} %20%0D%0A %20%0D%0AImagen en: %20%0D%0A ${url}`;
    dir.click()
   
    nombre.value = '';
    telefono.value = '';
    correo.value = '';
    tam.value = '';
    artesano.value = '';
    mensaje.value = ''; 
    imagen.src = "http://127.0.0.1:5500/pages/perzonalizado.html"
    imagen.style.display = 'none';
    
    document.getElementById('upload_widget').disabled = true;
    nombre.disabled = false;
    telefono.disabled = false;
    correo.disabled  = false; 
    tam.disabled  = false;
    artesano.disabled  = false;

    alertDiv.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <h3> Gracias, pronto estaremos en contacto </h3>
                </div>`;

}//sePreparanDatosParaEnvarMensaje


    
export{ obtenerMisPedidos }


// window.onload = function(){
//     //permite que carge todos los recursos externos
//     form.addEventListener('submit', formValidation);
    
    
// }


