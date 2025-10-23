# 📚 **Examen 2**

## **Introducción**

- **Nombre del proyecto:** _Control de un Servomotor_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _22/09/2025_  
- **Descripción breve:** _En este apartado se muestra mi segundo examen sobre el control de Servomotores con comandos._

### **Control de Servomotores con comandos**


1) **Hardware mínimo**

- _1 × servomotor en un pin PWM (50 Hz)._

- _3 × botones:_

- _**BTN_MODE**: cambia el modo activo (cíclico: Entrenamiento → Continuo → Step → …)._

- _**BTN_NEXT**: avanza a la siguiente posición (sólo en Step)._

- _**BTN_PREV**: retrocede a la posición anterior (sólo en Step)._
- _Pi pico 2_

2) **Que debe hacer:**

 **Modo Entrenamiento**

- _Se recibe texto por USB-serial con los comandos siguientes (se aceptan minúsculas/mayúsculas indistintamente y también sus alias en inglés):_

- Borrar (alias: clear, borrar)

 * Sintaxis: Borrar

 * Efecto: elimina la lista completa de posiciones.

 * Respuesta: OK.

 Escribir (alias: write, escribir)

 - _Sintaxis: Escribir, v1, v2, ..., vn_

 - _vi son enteros en 0–180._

- _fecto: sobrescribe la lista con los valores dados en ese orden._
- _Respuesta: OK si todos son válidos y la lisa de posiciones; si alguno está fuera de rango o la lista queda vacía → Error argumento invalido._

Reemplazar (alias: replace, reemplazar)

- _Sintaxis: Reemplazar, i, v_

- _Índice i en base 1 (1 = primera posición)._

- _v en 0–180._

- _Efecto: reemplaza el elemento i por v._

- _Respuesta: OK. Si i no existe → Error indice invalido. Si v fuera de rango → Error argumento invalido._

**Modo Continuo**
- _Recorre todas las posiciones de la lista en orden, moviendo el servo e imprimiendo cada 1.5 s:_

- _Formato: posX: V (por ejemplo, pos1: 90), donde X es base 1._

- _Si la lista está vacía: imprimir cada 1.5 s Error no hay pos y no mover el servo._

- _Al cambiar a otro modo, el ciclo se detiene inmediatamente._

**Modo Step**
- _BTN_NEXT: avanza una posición (si ya está en la última, se mantiene en esa última)._

- _BTN_PREV: retrocede una posición (si ya está en la primera, se mantiene en la primera)._

- _En cada cambio de posición:_

- _mover el servo a la posición seleccionada;_

- _imprimir posX: V._

- _Si la lista está vacía: al presionar BTN_NEXT o BTN_PREV, imprimir Error no hay pos y no mover el servo._

**INFO IMPORTANTE:** El movimiento de un servo requiere alimentacion 5-6v y en el pin de signal, un pwm a 50 HZ con un pulso de 1-2ms que representa 0-180 grados.

3) **Codigo:**
```
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/pwm.h"
#include <string>
 
using namespace std;
 
//CONFIGURACIÓN UART Y PINES
#define UART_ID uart0
#define BAUD_RATE 115200
#define UART_TX_PIN 0
#define UART_RX_PIN 1
 
#define SERVO_PIN 2
const uint BTNMODE = 3;
const uint BTNNEXT = 4;
const uint BTNPREV = 5;
 
 
int valores_guardados[3] = {0, 0, 0};
 
 
void borrar_lista() {
    for (int i = 0; i < 3; i++) valores_guardados[i] = 0;
    printf("Lista borrada.\n");
}
 
uint16_t angle_to_level(uint16_t angle) {
    float pulse_us = 1000.0f + (angle * 1000.0f / 180.0f);
    return (uint16_t)((pulse_us / 20000.0f) * 65535);
}
 
// main
int main() {
    stdio_init_all();
    sleep_ms(2000);
 
    printf("Modo de entrenamiento activado\n");
    printf("Escribe (write), reemplazar(replace), y borrar(clear) para opciones\n");
 
    // Inicialización UART
    uart_init(UART_ID, BAUD_RATE);
    gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);
    uart_set_format(UART_ID, 8, 1, UART_PARITY_NONE);
    uart_set_fifo_enabled(UART_ID, true);
 
    // PWM (Servo)
    gpio_set_function(SERVO_PIN, GPIO_FUNC_PWM);
    uint slice = pwm_gpio_to_slice_num(SERVO_PIN);
    uint chan  = pwm_gpio_to_channel(SERVO_PIN);
    pwm_set_wrap(slice, 65535);
    float f_clk = 125000000.0f;
    float div = f_clk / (50.0f * 65536.0f);
    pwm_set_clkdiv(slice, div);
    pwm_set_enabled(slice, true);
 
    // --- Configuración de botones ---
    gpio_init(BTNMODE); gpio_set_dir(BTNMODE, GPIO_IN); gpio_pull_up(BTNMODE);
    gpio_init(BTNNEXT); gpio_set_dir(BTNNEXT, GPIO_IN); gpio_pull_up(BTNNEXT);
    gpio_init(BTNPREV); gpio_set_dir(BTNPREV, GPIO_IN); gpio_pull_up(BTNPREV);
 
    // --- Variables de control ---
    string mensaje_usb = "", mensaje_uart = "";
    int modo_index = 0;
    int modo_actual = 1;     // 1: write, 2: continuo, 3: step
    bool btnmode_presionado = false, btnnext_presionado = false, btnprev_presionado = false;
    bool ciclo_activo = false;
 
    // ==== BUCLE PRINCIPAL ====
    while (true) {
        // --- Lectura USB ---
        int ch = getchar_timeout_us(0);
        if (ch != PICO_ERROR_TIMEOUT) {
            if (ch == '\n' || ch == '\r') {
                if (!mensaje_usb.empty()) {
                    string comando = mensaje_usb;
 
                    // ---- MODO WRITE ----
                    if (comando == "write" || comando == "escribir" || comando == "Write" || comando == "Escribir") {
                        printf("Ingresa 3 valores separandolas por comas (ej: 10,20,30):\n");
                        string entrada_valores = "";
                        while (true) {
                            int c2 = getchar_timeout_us(0);
                            if (c2 != PICO_ERROR_TIMEOUT) {
                                if (c2 == '\n' || c2 == '\r') break;
                                entrada_valores += (char)c2;
                            }
                        }
 
                        int i = 0; string temp = ""; bool error = false; int num_comas = 0;
                        for (char c : entrada_valores) {
                            if (c == ',') {
                                num_comas++;
                                if (i < 3) {
                                    int val = stoi(temp);
                                    if (val < 0 || val > 180) { error = true; break; }
                                    valores_guardados[i] = val;
                                    temp = ""; i++;
                                }
                            } else temp += c;
                        }
                        if (!error && !temp.empty() && i < 3) {
                            int val = stoi(temp);
                            if (val < 0 || val > 180) error = true;
                            else valores_guardados[i] = val;
                            i++;
                        }
 
                        if (i != 3 || num_comas != 2) printf("Error, tienen que ser 3 numeros\n");
                        else if (error) printf("Error, valores de 0 a 180\n");
                        else printf("Valores guardados: %d, %d, %d\n", valores_guardados[0], valores_guardados[1], valores_guardados[2]);
                    }
 
                    // ---- MODO CLEAR ----
                    else if (comando == "clear" || comando == "borrar" || comando == "Clear" || comando == "Borrar") {
                        borrar_lista();
                    }
 
                    // ---- MODO REPLACE ----
                    else if (comando == "replace" || comando == "reemplazar" || comando == "Replace" || comando == "Reemplazar") {
                        printf("Formato: Replace:posicion,valor (ej: Replace:1,130)\n");
                        string entrada_replace = "";
                        while (true) {
                            int c2 = getchar_timeout_us(0);
                            if (c2 != PICO_ERROR_TIMEOUT) {
                                if (c2 == '\n' || c2 == '\r') break;
                                entrada_replace += (char)c2;
                            }
                        }
 
                        int pos = -1, val = -1; string temp=""; bool sep=false;
                        for (char c : entrada_replace) {
                            if (c == ',' && !sep) {
                                pos = stoi(temp)-1; temp=""; sep=true;
                            } else temp+=c;
                        }
                        if (sep && !temp.empty()) val = stoi(temp);
 
                        if (pos<0 || pos>2) printf("Error: posición inválida\n");
                        else if (val<0 || val>180) printf("Error: inválido\n");
                        else {
                            valores_guardados[pos]=val;
                            printf("Valor reemplazado: pos%d = %d\n", pos+1, val);
                            printf("Lista: %d, %d, %d\n", valores_guardados[0], valores_guardados[1], valores_guardados[2]);
                        }
                    }
 
                    mensaje_usb="";
                }
            } else mensaje_usb += (char)ch;
        }
 
        // --- Lectura botones ---
        bool bmode = gpio_get(BTNMODE)==0, bnext = gpio_get(BTNNEXT)==0, bprev = gpio_get(BTNPREV)==0;
 
        // ---- Cambio de modo ----
        if (bprev && !btnprev_presionado) {
            modo_actual++;
            if (modo_actual>3) modo_actual=1;
            printf("Cambio a modo %d\n", modo_actual);
            ciclo_activo = (modo_actual==3);
            btnprev_presionado=true;
        } else if (!bprev) btnprev_presionado=false;
 
        // ---- Modo step ----
        if (modo_actual==2) {
            if (bmode && !btnmode_presionado) {
                if (modo_index>0) modo_index--;
                pwm_set_chan_level(slice, chan, angle_to_level(valores_guardados[modo_index]));
                printf("Servo a %d°\n", valores_guardados[modo_index]);
                btnmode_presionado=true;
            } else if (!bmode) btnmode_presionado=false;
 
            if (bnext && !btnnext_presionado) {
                if (modo_index<2) modo_index++;
                pwm_set_chan_level(slice, chan, angle_to_level(valores_guardados[modo_index]));
                printf("Servo a %d°\n", valores_guardados[modo_index]);
                btnnext_presionado=true;
            } else if (!bnext) btnnext_presionado=false;
        }
 
        // ---- Modo continuo ----
        if (modo_actual==3 && ciclo_activo) {
            bool vacia = (valores_guardados[0]==0 && valores_guardados[1]==0 && valores_guardados[2]==0);
            if (vacia) {
                printf("Error: no hay lista de valores\n");
                sleep_ms(1500);
            } else {
                for (int i=0;i<3;i++) {
                    pwm_set_chan_level(slice, chan, angle_to_level(valores_guardados[i]));
                    printf("pos%d: %d\n", i+1, valores_guardados[i]);
                    for (int t=0;t<15;t++) {
                        sleep_ms(100);
                        if (!ciclo_activo) break;
                    }
                    if (!ciclo_activo) break;
                }
            }
        }
 
        sleep_ms(10);
    }
}
```

4) **Esquematico de conexion:**
![Esquema de conexión](E2.png)

5) **Video:**

<div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; margin-bottom: 1em;">
  <iframe src="https://www.youtube.com/embed/GwtElrbYVgk"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none;"
          allowfullscreen>
  </iframe>
</div>