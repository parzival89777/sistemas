# 📚 **Tarea 8**

## **Introducción**

- **Nombre del proyecto:** _Uart_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _22/10/2025_  
- **Descripción breve:** _En este apartado se muestra un ejercicio de la comunicación UART entre 2 Raspberry Pi Pico 2._

### **Comunicación**

1) **Que debe hacer:**


_En Serial Monitor usando un comando encender el led de la otra Raspberry Pi Pico 2 o con un botón, ambas Raspberry Pi Pico 2 conectadas en un mismo GND y usando sus RX y TX._

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
                } else if(c=="Comando invalido"){
                    printf("Comando invalido\n");
                }
                else{
                    uart_puts(UART_ID, "Comando invalido\n");
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

4) **Esquematico de conexion:**
![Esquema de conexión](T8.png)

5) **Video:**

<div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; margin-bottom: 1em;">
  <iframe src="https://www.youtube.com/ebed/gje9RdGbTqA"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none;"
          allowfullscreen>
  </iframe>
</div>