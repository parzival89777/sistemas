# 📚 **Examen 2**

## **Introducción**

- **Nombre del proyecto:** _Control de un Servomotor_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Sistemas embebidos 1_  
- **Fecha:** _22/09/2025_  
- **Descripción breve:** _En este apartado se muestra mi segundo examen sobre el control de Servomotores con comandos._

### **Control de Servomotores con comandos**

1) **Que debe hacer:**
- Modo Entrenamiento
Se recibe texto por USB-serial con los comandos siguientes (se aceptan minúsculas/mayúsculas indistintamente y también sus alias en inglés):

Borrar (alias: clear, borrar)

Sintaxis: Borrar

Efecto: elimina la lista completa de posiciones.

Respuesta: OK.

Escribir (alias: write, escribir)

Sintaxis: Escribir, v1, v2, ..., vn

vi son enteros en 0–180.

Efecto: sobrescribe la lista con los valores dados en ese orden.

Respuesta: OK si todos son válidos y la lisa de posiciones; si alguno está fuera de rango o la lista queda vacía → Error argumento invalido.

Reemplazar (alias: replace, reemplazar)

Sintaxis: Reemplazar, i, v

Índice i en base 1 (1 = primera posición).

v en 0–180.

Efecto: reemplaza el elemento i por v.

Respuesta: OK. Si i no existe → Error indice invalido. Si v fuera de rango → Error argumento invalido.


2) Modo Continuo
Recorre todas las posiciones de la lista en orden, moviendo el servo e imprimiendo cada 1.5 s:

Formato: posX: V (por ejemplo, pos1: 90), donde X es base 1.

Si la lista está vacía: imprimir cada 1.5 s Error no hay pos y no mover el servo.

Al cambiar a otro modo, el ciclo se detiene inmediatamente.


3) Modo Step
BTN_NEXT: avanza una posición (si ya está en la última, se mantiene en esa última).

BTN_PREV: retrocede una posición (si ya está en la primera, se mantiene en la primera).

En cada cambio de posición:

mover el servo a la posición seleccionada;

imprimir posX: V.

Si la lista está vacía: al presionar BTN_NEXT o BTN_PREV, imprimir Error no hay pos y no mover el servo.

INFO IMPORTANTE: El movimiento de un servo requiere alimentacion 5-6v y en el pin de signal, un pwm a 50 HZ con un pulso de 1-2ms que representa 0-180 grados
3) **Codigo:**
```

```

4) **Esquematico de conexion:**
![Esquema de conexión](E2.png)

5) **Video:**

<div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; margin-bottom: 1em;">
  <iframe src="https://www.youube.com/embed/YFGwNF2riHw"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none;"
          allowfullscreen>
  </iframe>
</div>