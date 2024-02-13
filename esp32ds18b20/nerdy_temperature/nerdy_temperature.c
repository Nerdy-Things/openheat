#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_check.h"
#include "onewire_bus.h"
#include "ds18b20.h"

static const char *TAG = "TEMP";

#define ONEWIRE_BUS_GPIO    17

ds18b20_device_handle_t ds18b20s;
onewire_device_iter_handle_t iter = NULL;
onewire_device_t next_onewire_device;
esp_err_t search_result = ESP_OK;


#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_check.h"
#include "onewire_bus.h"
#include "onewire_cmd.h"
#include "onewire_crc.h"
#include "ds18b20.h"

float nerdy_temperature_get(void) 
{
    float temperature;
    ESP_ERROR_CHECK(ds18b20_trigger_temperature_conversion(ds18b20s));
    ESP_ERROR_CHECK(ds18b20_get_temperature(ds18b20s, &temperature));

    if (temperature > 4000) {
        temperature = temperature - 4096.0;
    }
    ESP_LOGI(TAG, "temperature read from DS18B20: %.2fC", temperature);
    return temperature;
}

void nerdy_temperature_init(void)
{
    // install new 1-wire bus
    onewire_bus_handle_t bus;
    onewire_bus_config_t bus_config = {
        .bus_gpio_num = ONEWIRE_BUS_GPIO,
    };
    onewire_bus_rmt_config_t rmt_config = {
        .max_rx_bytes = 10, // 1byte ROM command + 8byte ROM number + 1byte device command
    };
    ESP_ERROR_CHECK(onewire_new_bus_rmt(&bus_config, &rmt_config, &bus));
    ESP_LOGI(TAG, "1-Wire bus installed on GPIO%d", ONEWIRE_BUS_GPIO);
    // create 1-wire device iterator, which is used for device search
    ESP_ERROR_CHECK(onewire_new_device_iter(bus, &iter));
    ESP_LOGI(TAG, "Device iterator created, start searching...");
    search_result = onewire_device_iter_get_next(iter, &next_onewire_device);
    // found a new device, let's check if we can upgrade it to a DS18B20
    if (search_result == ESP_OK) { 
        ds18b20_config_t ds_cfg = {};
        if (ds18b20_new_device(&next_onewire_device, &ds_cfg, &ds18b20s) == ESP_OK) {
            ESP_LOGI(TAG, "Found a DS18B20, address: %016llX", next_onewire_device.address);
        } else {
            ESP_LOGI(TAG, "Found an unknown device, address: %016llX", next_onewire_device.address);
        }
    }
    ESP_ERROR_CHECK(onewire_del_device_iter(iter));
    ESP_LOGI(TAG, "Searching done DS18B20 device found");
    // set resolution for DS18B20
    ESP_ERROR_CHECK(ds18b20_set_resolution(ds18b20s, DS18B20_RESOLUTION_12B));
}
