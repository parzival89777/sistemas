# 📚 **Tarea 8**

## **Introducción**

- **Nombre del proyecto:** _UART_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _22/09/2025_  
- **Descripción breve:** _En este apartado se muestran 2 ejercicios de comunicación UART entre dos Raspberry Pi Pico 2._

### **Ejercicio 1**

1) **Que debe hacer:**
_Encender el led conectado a otra Raspberry mediante un botón conectado a la otra Raspbeerry._

2) **Codigo:**
```
#include "pico/stdlib.h"
#include "hardware/uart.h"
 
#define UART_ID uart0
#define BAUD_RATE 9600
 
#define UART_TX_PIN 0
#define UART_RX_PIN 1
 
#define LED_PIN 15
#define BUTTON_PIN 16
 
int main() {
    stdio_init_all();
    uart_init(UART_ID, BAUD_RATE);
    gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);
 
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
 
    gpio_init(BUTTON_PIN);
    gpio_set_dir(BUTTON_PIN, GPIO_IN);
    gpio_pull_up(BUTTON_PIN);
 
    bool last_button_state = true;
    bool led_state = false;
 
    while (true) {
        bool button_state = gpio_get(BUTTON_PIN);
 
        // Si se detecta una pulsación (de HIGH a LOW)
        if (last_button_state && !button_state) {
            uart_putc(UART_ID, 'T'); // Enviamos el carácter 'T' al otro Pico
            sleep_ms(200); // anti rebote
        }
        last_button_state = button_state;
 
        // Si se recibe un byte por UART
        if (uart_is_readable(UART_ID)) {
            char c = uart_getc(UART_ID);
            if (c == 'T') {
                led_state = !led_state; // Cambiar estado del LED
                gpio_put(LED_PIN, led_state);
            }
        }
 
        sleep_ms(10);
    }
}

```

3) **Esquematico de conexion:**
![Esquema de conexión](T8.png)

4) **Video:**

<div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; margin-bottom: 1em;">
  <iframe src="https://www.youtube.com/embed/BpNMVizb54Y"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none;"
          allowfullscreen>
  </iframe>
</div>

### **Ejercicio 2**

1) **Que debe hacer:**
_Encender el led conectado a otra Raspberry mediante un botón y/o un comando en el Serial Monitor conectado a la otra Raspbeerry._

2) **Codigo:**
```
#include "pico/stdlib.h"
#include "hardware/uart.h"
#include <stdio.h>
#include <string>
 
#define UART_ID uart0
#define BAUD_RATE 115200
#define TX_PIN 0
#define RX_PIN 1
#define button_pin 16
#define led_PIN 15
using namespace std;
 
int main() {
    stdio_init_all();
 
    gpio_set_function(TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(RX_PIN, GPIO_FUNC_UART);
 
    uart_init(UART_ID, BAUD_RATE);
    uart_set_format(UART_ID, 8, 1, UART_PARITY_NONE);
 
    gpio_init(button_pin);
    gpio_set_dir(button_pin, GPIO_IN);
    gpio_pull_up(button_pin);
    gpio_init(led_PIN);
    gpio_set_dir(led_PIN, GPIO_OUT);
 
    string c = "";
    string p="";
    while (true){
 
        int ch = getchar_timeout_us(0);
        if (ch != PICO_ERROR_TIMEOUT) {
            printf("Eco: %c\n", (char)ch);
            p+= (char)ch;
            if(ch=='.' || ch=='\n'){
                uart_puts(UART_ID, p.c_str());
                p="";
            }
        }
        int a;
        if (gpio_get(button_pin) == 0 && a == 1) {
            printf("Button pressed!\n");
            uart_puts(UART_ID, "LEDON\n");
            sleep_ms(200); 
        }
         a= gpio_get(button_pin);
 
        if (uart_is_readable(uart0)) {
            char character = uart_getc(uart0);
            printf(character+"\n");
            if(character=='\n' || character=='.'){
                if (c == "LEDON"){
                    gpio_put(led_PIN, 1);
                    printf("LED is ON\n");
                }
                else if (c == "LEDOFF"){
                    gpio_put(led_PIN, 0);
                    printf("LED is OFF\n");
                } else if(c=="Invalid Command"){
                    printf("Invalid Command\n");
                }
                else{
                    uart_puts(UART_ID, "Invalid Command\n");
                }
                c = "";
                continue;
            }
            else{
                c += character;
            }
        }
    }
}
```

3) **Esquematico de conexion:** _Usamos la misma conexión que en el ejercicio 1_
![Esquema de conexión](T8.png)

4) **Video:**

<div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; margin-bottom: 1em;">
  <iframe src=" "
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none;"
          allowfullscreen>
  </iframe>
</div>