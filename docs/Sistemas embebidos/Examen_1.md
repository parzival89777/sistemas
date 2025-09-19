# 📚 **Examen 1**

## **Introducción**

- **Nombre del proyecto:** _Simón Dice (4 colores) – RP Pico 2_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _22/09/2025_  
- **Descripción breve:** _En este apartado se muestra mi primer examen el cual es el juego "Simón dice" con 4 leds de diferentes colores, todo programado con una Raspberry pi pico2._

### **Ejercicio 1**

1) **Que debe hacer:**

- _Construir un juego Simón Dice de 4 colores en Raspberry Pi Pico 2._


- _La secuencia crece +1 por ronda, de 1 hasta 15._


- _La persona jugadora debe repetir la secuencia con 4 botones dentro de un tiempo límite por ronda._


- _Tiempo límite por ronda (fase de entrada): TL = longitud + 5 segundos (p. ej., Ronda 7 → 12 s)._


- _Puntaje (0–15): mostrar la máxima ronda alcanzada en un display de 7 segmentos en hex (0–9, A, b, C, d, E, F)._


- _Aleatoriedad obligatoria: la secuencia debe ser impredecible en cada ejecución._

2) **Reglas del juego**

- _Encendido/Reset: el 7 segmentos muestra “0” y queda en espera de Start (cualquier botón permite iniciar)._

- _Reproducción: mostrar la secuencia actual (LEDs uno por uno con separación clara)._

- _Entrada: al terminar la reproducción, la persona debe repetir la secuencia completa dentro de TL._

- _Fallo (Game Over): botón incorrecto, falta/extra de entradas o exceder TL._

- _Progresión: si acierta, puntaje = número de ronda, agrega 1 color aleatorio y avanza._

- _Fin: al fallar o completar la Ronda 15. Mostrar puntaje final en 7 segmentos (hex)._

3) **Codigo:**
```
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "pico/time.h"
 
#define LED_A 0
#define LED_B 1
#define LED_C 2
#define LED_D 3
 
static const uint8_t leds[] = { LED_A, LED_B, LED_C, LED_D };
 
static const uint32_t periodos_us[] = {
    300000u,
    200000u,
    120000u,
     80000u
};
 
static uint32_t proximo_cambio[4];
 
int main() {
 
    for (int i = 0; i < 4; i++) {
        gpio_init(leds[i]);
        gpio_set_dir(leds[i], true);
        gpio_put(leds[i], false);
    }
 
    uint32_t t_actual = time_us_32();
    for (int i = 0; i < 4; i++) {
        proximo_cambio[i] = t_actual + periodos_us[i];
    }
 
    while (true) {
        t_actual = time_us_32();
        for (int i = 0; i < 4; i++) {
            if ((int32_t)(t_actual - proximo_cambio[i]) >= 0) {
                gpio_xor_mask(1u << leds[i]);
                proximo_cambio[i] += periodos_us[i];
            }
        }
        tight_loop_contents();
    }
}
```

4) **Esquematico de conexion:**
![Esquema de conexión](T4.png)

5) **Video:**

[Video en youtube](https://youtube.com/shorts/lCiT8hK5L0s)