idf_component_register(
    SRCS "nerdy_temperature.c"
    REQUIRES driver ds18b20 onewire_bus
    INCLUDE_DIRS "."
)
