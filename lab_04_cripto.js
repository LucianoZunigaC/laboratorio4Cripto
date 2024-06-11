// ==UserScript==
// @name         Extraer Clave, Contar y Descifrar Mensajes
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extrae la clave de cifrado, cuenta y descifra los mensajes en cripto.tiiny.site usando 3DES
// @author       Su Nombre
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {

        var primerParrafo = document.querySelector('p');
        if (!primerParrafo) {
            console.error("No se encontró el primer párrafo");
            return;
        }

        var primerParrafoTexto = primerParrafo.textContent;

        var mayusculas = primerParrafoTexto.match(/[A-Z]/g);

        if (!mayusculas) {
            console.log("No se encontraron mayúsculas en el primer párrafo");
            return;
        }

        var tresDESKey = mayusculas.join('');
        console.log("La llave es: " + tresDESKey);

        const encryptedElements = document.querySelectorAll('div[id]');
        const numberOfMessages = encryptedElements.length;

        console.log("Los mensajes cifrados son: " + numberOfMessages);

        function decryptMessage(encrypted, key) {
            const parsedKey = CryptoJS.enc.Utf8.parse(key);
            const decrypted = CryptoJS.TripleDES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(encrypted)
            }, parsedKey, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }


        const container = document.createElement('div');
        container.id = 'decrypted-messages';
        document.body.appendChild(container);


        encryptedElements.forEach(element => {
            const encryptedMessage = element.id;
            try {

                const decryptedMessage = decryptMessage(encryptedMessage, tresDESKey);

                console.log(decryptedMessage);

                const messageElement = document.createElement('p');
                messageElement.textContent = decryptedMessage;
                container.appendChild(messageElement);
            } catch (error) {
                console.error(`Error descifrando el mensaje (${element.className}): `, error);
            }
        });
    });
})();
