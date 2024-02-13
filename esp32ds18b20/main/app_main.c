/**
 * Copyright 2024  Ievgenii Tkachenko
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"
#include "esp_log.h"
#include <inttypes.h>
#include <string.h>
#include "config.h"
#include "nerdy_wifi.h"
#include "nerdy_http_request.h"
#include "nerdy_mac_address.h"
#include "nerdy_temperature.h"

static const char *TAG = "MAIN";

#define UPDATE_INTERVAL_SLOW 60000
#define UPDATE_INTERVAL_FAST 1000

/**
 * Sends temperature sensor value to the network
*/

void send_temperature() 
{
    char *message;
    // Build a message 
    asprintf(&message, "{\"mac_address\": \"%s\" , \"temperature\": \"%f\"}\n", nerdy_get_mac_address(), nerdy_temperature_get());
    // Send message
    nerdy_http_post_request(SERVER_NAME, SERVER_PORT, TEMPERATURE_POST_URL, message);
    // Release message from memory
    free(message);
    // Log to the console
    ESP_LOGI(TAG, "Message is sent to %s %s %s", SERVER_NAME, SERVER_PORT, TEMPERATURE_POST_URL);
}

/**
 * App entry point
*/
void app_main(void)
{
    // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }

    ESP_ERROR_CHECK(ret);

    // Connect ESP32 to a Wi-Fi network. 
    // Change Access Point Name and Password in the config. 
    // Read the README.md or nerdy_wifi/README.md for details!!!
    nerdy_wifi_connect();
    nerdy_temperature_init();
    while (true) {
        if (nerdy_wifi_ip_address != NULL) {
            send_temperature();
            // Delay for 60000 milliseconds (60 second)
            vTaskDelay(UPDATE_INTERVAL_SLOW / portTICK_PERIOD_MS);
        } else {
            // Delay for 60000 milliseconds (60 second)
            vTaskDelay(UPDATE_INTERVAL_FAST / portTICK_PERIOD_MS);
        }
    }
}