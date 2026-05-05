import smtplib
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

def enviar_correo_compra(email_destino, detalles_texto, detalles_html):
    """
    Envía un correo electrónico con los detalles de la compra usando Gmail SMTP.

    Args:
        email_destino (str): Correo del cliente.
        detalles_texto (str): Texto plano con los detalles de la compra.
        detalles_html (str): HTML con el formato de la factura.
    """
    # Configuración de Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # Puerto para TLS
    email_remitente = "tiendaonlinecapilar@gmail.com"  # Tu correo
    password = "wwxh kiqf nwom diit"  # Tu contraseña de aplicación

    # Crear el mensaje multipart
    mensaje = MIMEMultipart('alternative')
    mensaje['From'] = email_remitente
    mensaje['To'] = email_destino
    mensaje['Subject'] = "Confirmación de tu compra en Capilarshop"

    # Cuerpo del correo
    texto = f"""
¡Gracias por tu compra en Capilarshop!

Detalles de la compra:
{detalles_texto}

Si tienes alguna pregunta, contáctanos.

Saludos,
Equipo de Capilarshop
"""
    mensaje.attach(MIMEText(texto, 'plain'))
    detalles_html_sin_imagenes = re.sub(r'<img\b[^>]*>', '', detalles_html, flags=re.IGNORECASE)
    mensaje.attach(MIMEText(detalles_html_sin_imagenes, 'html'))

    try:
        servidor = smtplib.SMTP(smtp_server, smtp_port)
        servidor.starttls()  # Iniciar TLS
        servidor.login(email_remitente, password)
        servidor.sendmail(email_remitente, email_destino, mensaje.as_string())
        servidor.quit()
        print("Correo enviado exitosamente.")
        return True
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return False

@app.route('/enviar-correo', methods=['POST'])
def enviar_correo_endpoint():
    data = request.json
    print('POST /enviar-correo recibido:', data)
    email = data.get('email')
    detalles_texto = data.get('detalles_texto')
    detalles_html = data.get('detalles_html')
    if not email or not detalles_texto or not detalles_html:
        return jsonify({"error": "Faltan datos: email, detalles_texto o detalles_html"}), 400
    
    exito = enviar_correo_compra(email, detalles_texto, detalles_html)
    if exito:
        return jsonify({"mensaje": "Correo enviado exitosamente"})
    else:
        return jsonify({"error": "Error al enviar el correo"}), 500

# Ejemplo de uso (puedes llamar esta función desde tu código principal)
if __name__ == "__main__":
    app.run(debug=True)