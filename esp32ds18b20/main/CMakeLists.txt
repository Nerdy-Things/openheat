idf_component_register(
    SRCS "app_main.c"
    REQUIRES nvs_flash esp_wifi esp_event driver nerdy_wifi nerdy_http_request nerdy_mac_address nerdy_temperature
    INCLUDE_DIRS "."
)
