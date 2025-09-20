# 📚 **Tarea 6**

## **Introducción**

- **Nombre del proyecto:** _Ejercicios de medicion_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _17/09/2025_  
- **Descripción breve:** _En este apartado se muestran 2 ejercicios el uso de 4 alarmas con leds y una actualización del juego "Led Pong"._

### **Ejercicio 1**

1) **Que debe hacer:**
_Configurar ALARM0..ALARM3 del timer de sistema en modo µs. Cada alarma controla un LED distinto con un periodo propio. ._

2) **Codigo:**
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

3) **Esquematico de conexion:**
![Esquema de conexión](T4.png)

4) **Video:**

[Video en youtube](https://youtube.com/shorts/lCiT8hK5L0s)

### **Ejercicio 2**

1) **Que debe hacer:**
_Modificar su pong, para tener dos botones adicionales, que suban y bajen la velocidad del juego sin delay._

2) **Codigo:**
```
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/timer.h"
#include <stdlib.h>


// --- Pines ---
#define LED_RED    0
#define LED_GREEN  1
#define LED_BLUE   2
#define LED_YELLOW 3

#define BTN_RED    4
#define BTN_GREEN  5
#define BTN_BLUE   6
#define BTN_YELLOW 7

#define SEG_A 8
#define SEG_B 9
#define SEG_C 10
#define SEG_D 11
#define SEG_E 12
#define SEG_F 13
#define SEG_G 14
#define SEG_DP 15

#define MAX_RONDA 15

// --- Estado del juego ---
uint8_t secuencia[MAX_RONDA];  // secuencia de colores (0–3)
uint8_t ronda_actual = 0;

// Mapeo de LEDs y botones
const uint8_t leds[4] = {LED_RED, LED_GREEN, LED_BLUE, LED_YELLOW};
const uint8_t botones[4] = {BTN_RED, BTN_GREEN, BTN_BLUE, BTN_YELLOW};

// Tabla de 7 segmentos (0–F)
const uint8_t tabla7seg[16] = {
    0b0111111, // 0
    0b0000110, // 1
    0b1011011, // 2
    0b1001111, // 3
    0b1100110, // 4
    0b1101101, // 5
    0b1111101, // 6
    0b0000111, // 7
    0b1111111, // 8
    0b1101111, // 9
    0b1110111, // A
    0b1111100, // b
    0b0111001, // C
    0b1011110, // d
    0b1111001, // E
    0b1110001  // F
};

// --- Inicialización ---
void init_leds() {
    for(int i=0;i<4;i++) {
        gpio_init(leds[i]);
        gpio_set_dir(leds[i], GPIO_OUT);
        gpio_put(leds[i],0);
    }
}

void init_botones() {
    for(int i=0;i<4;i++) {
        gpio_init(botones[i]);
        gpio_set_dir(botones[i], GPIO_IN);
        gpio_pull_up(botones[i]);
    }
}

void init_display() {
    for(int i=SEG_A;i<=SEG_G;i++){
        gpio_init(i);
        gpio_set_dir(i, GPIO_OUT);
        gpio_put(i,0);
    }
}

// --- Mostrar en 7 segmentos ---
void mostrar_hex(uint8_t val){
    uint8_t mask = tabla7seg[val & 0x0F];
    for(int i=0;i<7;i++){
        gpio_put(SEG_A+i, (mask>>i)&1);
    }
}

// --- Reproducir secuencia ---
void reproducir_secuencia(uint8_t longitud){
    for(int i=0;i<longitud;i++){
        gpio_put(leds[secuencia[i]],1);
        sleep_ms(500);
        gpio_put(leds[secuencia[i]],0);
        sleep_ms(250);
    }
}

// --- Leer entrada del jugador con límite de tiempo ---
bool leer_entrada(uint8_t ronda){
    uint32_t inicio = to_us_since_boot(get_absolute_time());
    uint32_t limite = (ronda + 5)*1000000u; // µs

    for(int i=0;i<ronda;i++){
        bool acierto=false;
        while(to_us_since_boot(get_absolute_time()) - inicio < limite){
            for(int j=0;j<4;j++){
                if(!gpio_get(botones[j])){ // botón presionado
                    if(j==secuencia[i]) acierto=true;
                    sleep_ms(50); // debouncing
                    while(!gpio_get(botones[j])); // espera a soltar
                    break;
                }
            }
            if(acierto) break;
        }
        if(!acierto){
            ronda_actual = 0;      // reiniciar marcador
            mostrar_hex(0);        // mostrar "0" en el display
            return false;          // Game Over
        }
    }
    return true;
}

// --- Agregar nuevo color aleatorio ---
void agregar_color(){
    secuencia[ronda_actual] = rand()%4;
    ronda_actual++;
}

// --- Main ---
int main(){
    stdio_init_all();
    init_leds();
    init_botones();
    init_display();
    mostrar_hex(0); // espera de inicio

    while(true){
        // esperar botón para iniciar
        while(gpio_get(BTN_RED) && gpio_get(BTN_GREEN) &&
              gpio_get(BTN_BLUE) && gpio_get(BTN_YELLOW)){
            tight_loop_contents();
        }

        ronda_actual=0;
        srand(to_us_since_boot(get_absolute_time())); // semilla aleatoria
        agregar_color(); // primer color

        while(ronda_actual<=MAX_RONDA){
            mostrar_hex(ronda_actual);
            reproducir_secuencia(ronda_actual);

            if(!leer_entrada(ronda_actual)){
                mostrar_hex(ronda_actual); // puntaje final
                break; // Game Over
            }

            if(ronda_actual==MAX_RONDA) break; // Ronda 15 completada

            agregar_color(); // siguiente ronda
        }
    }
}
```

3) **Esquematico de conexion:**
![Esquema de conexión](T4.png)

4) **Video:**

[Video en youtube](https://youtube.com/shorts/lCiT8hK5L0s)

