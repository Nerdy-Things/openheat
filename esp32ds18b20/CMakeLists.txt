# The following lines of boilerplate have to be in your project's CMakeLists
# in this exact order for cmake to work correctly
cmake_minimum_required(VERSION 3.16)

set(EXTRA_COMPONENT_DIRS    
    nerdy_wifi
    nerdy_http_request
    nerdy_mac_address
    nerdy_temperature
)

include($ENV{IDF_PATH}/tools/cmake/project.cmake)

project(app_main)
