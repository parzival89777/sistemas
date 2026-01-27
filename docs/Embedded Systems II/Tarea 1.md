# 📚 Activity 01

## **Introducción**

- **Nombre:** _RTOS Tasks_  
- **Equipo / Autor(es):** _Rodrigo Miranda Flores_  
- **Curso / Asignatura:** _Embedded Systems II_  
- **Fecha:** _03/01/2026_  
- **Descripción breve:** _Solve the tasks 1-5 about RTOS._

**Tasks**

![Tasks](Task.png)

1) **Excercise 1 — Identify Logical Tasks**

_List the logical tasks that exist in this system._

_Assume:_

- _The system runs on a microcontroller_
- _Timing matters_
- _Some operations may block (Wi-Fi, storage)_


|Task Name|Trigger|Periodic or Event-Based|
|---------|--------|------|
|Reads a temperature sensor|50 ms timer|Periodic|
|Sends sensor data via Wi-Fi|2 s timer|Periodic|
|Monitors an emergency button| Button press|Event-Based|
|Blinks a status LED|1 Hz|Periodic|
|Stores error messages|Error event|Event-Based|


2) **Excercise 2 — Task Characteristics**

_For each task you identified, answer the following:_

_Is it time-critical? (Yes / No)_

_Can it block safely? (Yes / No)_

_What happens if this task is delayed?_

_Write short, technical answers._

|Task|Time-Critical|Block Safely|Effect|
|----|--------------|-----------------|------------------|
|Reads a temperature sensor|No|Yes|Sensor data is acquired later than expected, reducing temporal accuracy.|
|Sends sensor data via Wi-Fi|No|No|Data transmission may be delayed or communication may be affected if blocking occurs.|
|Monitors an emergency button|Yes|No| A delayed response could result in unsafe or hazardous conditions.|
|Blinks a status LED|No|Yes|LED behavior becomes inconsistent but does not affect system functionality.|
|Stores error messages|No|Yes|Error information may be lost or recorded late.|

3) **Excercise 3 — Priority Reasoning**

_Assign a relative priority to each task:_

- _High_
- _Medium_
- _Low_

_Then justify each choice in one sentence._

|Task|Priority|Justification|
|----|----------|---------------|
|Reads a temperature sensor|Medium|Requires regular execution but is not safety-critical.|
|Sends sensor data via Wi-Fi|Medium|Important for communication but tolerant to small delays.|
|Monitors an emergency button|High|Must respond immediately to ensure system safety.|
|Blinks a status LED|Low|Purely cosmetic and not functionally critical.|
|Stores error messages|Low|Useful for diagnostics but not time-sensitive.|


4) **Excercise 4 — Design Judgment (Trick Question)**

_Which of the following should NOT necessarily be implemented as a FreeRTOS task?_

- Emergency button monitoring_
- Wi-Fi transmission_
- Error logging_
- Status LED blinking_

_Explain why in 2–3 sentences._

**Task that should NOT necessarily be implemented as a FreeRTOS task:**

- _Emergency button monitoring_

**Explanation:**  
_Emergency button monitoring is better implemented using a hardware interrupt rather than a dedicated RTOS task. Interrupts provide faster and more deterministic response times, which is critical for safety-related inputs._


5) **Excercise 5 — Identifying Hidden Tasks in Pseudo-Code**

_The following pseudo-code represents a single-loop embedded program written without an RTOS._

```
while (1) {
    read_temperature_sensor();          // takes ~2 ms

    if (button_pressed()) {
        emergency_shutdown();            // must react immediately
    }

    if (time_since_last_send() > 2000) {
        send_data_over_wifi();            // may block for 100–300 ms
    }

    toggle_status_led();                 // 1 Hz blink rate

    delay_ms(10);
}
```
_Hidden tasks in pseudo-code may include:_

- _Interrupt Service Routines (ISRs)_
- _Background maintenance or idle tasks_
- _Deferred interrupt processing (e.g., using queues or semaphores)_
- _Watchdog or fault-monitoring mechanisms_

_These tasks are not always explicitly defined but still consume CPU time and affect scheduling behavior._