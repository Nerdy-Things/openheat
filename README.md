# OpenHeat 

The opensorce library that can control an automated relay switch based on schedule or temperature from sensors. 

# Youtube video

[![Watch the video](/raspberry/static/images/04_thumbnail.jpg)](https://www.youtube.com/watch?v=MPbWI9NfuoY)

# Repository Structure 

- ESP32DS18B20 - the software that goes to the ESP32 with a dallas thermo sensor. The http client that sends a temperature to the Raspberry server. Details are in the esp32ds18b20/README.md or in the Youtube Video. 
- RASPBERRY - the HTTP server that holds all data from all sensors. It decides when to enable or disable a relay device. Details in the Youtube Video. Details are in the rapberry/README.md or in the Youtube Video. 

# Features

- Enable/Disable the realay based on data from a particular thermometer sensor.
- Enable/Dissable the relay for a defined time.
- Show graphs of temperature from several sensors.


# Licence:

Copyright 2024  Ievgenii Tkachenko

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
