# Lab 01 — RTOS Basics with ESP-IDF LAB

**_The purpose of these labs 1-3 is to analyze changes in our code or new behaviors_**

## 1) Activity Goals  

+ Implement ______ (e.g., ROS2 node publishing joint + states)  
+ Validate ______ (e.g., Ackermann kinematics constraint)  
+ Document ______ (e.g., BOM with costs, wiring diagram)

## 2) Materials & Setup  
BOM (bill of materials)

|#|Item|Qty|Link/Source|Cost (MXN)|Notes|
|---------|--------|------|--------|--------|--------|
|1|ESP32|something|something|something|something|


**_Tools/Software_**  
OS/Env: Ubuntu 24.04 + ROS 2 Jazzy (WSL2 ok)  
Editors: VS Code, Python 3.12, Arduino IDE, RoboDK (if used)  
Slicers/ECAD: PrusaSlicer, Altium, Multisim  

**_Wiring / Safety_**  
Motor driver current limit: __ A (≤ spec)  
Battery: LiPo __S, follow charging protocol  
PPE / Risk notes:

## 3) Procedure (what you did)  
Step 1: Concise action with command(s)

Example: build ROS workspace

Step 2: Screenshots/console logs as needed  
Step 3: Verification checkpoint ✅  

4) Data, Tests & Evidence  
Test plan  
Inputs: __  
Expected: ____  
Metrics: RMSE, latency, current draw, etc.

Results:

Tables/plots  
Case | Input | Output | Error | Pass?  
A | … | … | … | ✅/❌  

5) Analysis  
Compare expected vs observed.  
Explain anomalies (friction, backlash, sampling, clipping).  
Link to equations/constraints (e.g., Pfaffian for nonholonomic: A(q)·q_dot = 0).  
Equations should be in a readable format (LaTeX or code).

Propose fixes (calibration, PID gains, step timing).

6) Code  
Short, runnable snippets only. Link big files to repo.

Example: publish joint states

Example: Arduino motor test (watch current & temperature)

7) Files & Media  
CAD/URDF: /urdf/arm_3dof.urdf.xacro  
Launch: /launch/sim.launch.py  
Firmware: /firmware/drive_test/  
Video demo (≤60 s): https://…  
Photos: img/sessionN_*  
