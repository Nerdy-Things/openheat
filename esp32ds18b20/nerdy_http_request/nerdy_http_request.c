#include <string.h>
#include "esp_event.h"
#include "esp_log.h"
#include "protocol_examples_common.h"

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"
#include "sdkconfig.h"

static const char *TAG = "nerdy_http_request";

static const char *REQUEST_POST = "POST %s HTTP/1.1\r\n"
    "Host: %s:%s\r\n"
    "User-Agent: esp-idf/1.0 esp32\r\n"
    "Content-Type: application/json\r\n"
    "Content-Length: %d\r\n"
    "Connection: close\r\n"
    "\r\n"
    "%s"
    ;


void nerdy_http_post_request(char* domain, char* port, char* path, char* body)
{
    char *message;
    // Build a message 
    asprintf(&message, REQUEST_POST, path, domain, port, strlen(body), body);
    printf(message);
    const struct addrinfo hints = {
        .ai_family = AF_INET,
        .ai_socktype = SOCK_STREAM,
    };
    struct addrinfo *res;
    struct in_addr *addr;
    int socket_handle, response_length;
    char recv_buf[64];

    int err = getaddrinfo(domain, port, &hints, &res);

    if(err != 0 || res == NULL) {
        ESP_LOGE(TAG, "DNS lookup failed err=%d res=%p", err, res);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        free(message);
        return;
    }

    /* Code to print the resolved IP.
        Note: inet_ntoa is non-reentrant, look at ipaddr_ntoa_r for "real" code */
    addr = &((struct sockaddr_in *)res->ai_addr)->sin_addr;
    ESP_LOGI(TAG, "DNS lookup succeeded. IP=%s", inet_ntoa(*addr));

    socket_handle = socket(res->ai_family, res->ai_socktype, 0);
    if(socket_handle < 0) {
        ESP_LOGE(TAG, "... Failed to allocate socket.");
        freeaddrinfo(res);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        free(message);
        return;
    }
    ESP_LOGI(TAG, "... allocated socket");

    if(connect(socket_handle, res->ai_addr, res->ai_addrlen) != 0) {
        ESP_LOGE(TAG, "... socket connect failed errno=%d", errno);
        close(socket_handle);
        freeaddrinfo(res);
        vTaskDelay(4000 / portTICK_PERIOD_MS);
        free(message);
        return;
    }

    ESP_LOGI(TAG, "... connected");
    freeaddrinfo(res);

    if (write(socket_handle, message, strlen(message)) < 0) {
        ESP_LOGE(TAG, "... socket send failed");
        close(socket_handle);
        vTaskDelay(4000 / portTICK_PERIOD_MS);
        free(message);
        return;
    }
    ESP_LOGI(TAG, "... socket send success");

    struct timeval receiving_timeout;
    receiving_timeout.tv_sec = 5;
    receiving_timeout.tv_usec = 0;
    if (setsockopt(socket_handle, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout,
            sizeof(receiving_timeout)) < 0) {
        ESP_LOGE(TAG, "... failed to set socket receiving timeout");
        close(socket_handle);
        vTaskDelay(4000 / portTICK_PERIOD_MS);
        free(message);
        return;
    }
    ESP_LOGI(TAG, "... set socket receiving timeout success");

    /* Read HTTP response */
    do {
        bzero(recv_buf, sizeof(recv_buf));
        response_length = read(socket_handle, recv_buf, sizeof(recv_buf)-1);
        for(int i = 0; i < response_length; i++) {
            putchar(recv_buf[i]);
        }
    } while(response_length > 0);

    ESP_LOGI(TAG, "... done reading from socket. Last read return=%d errno=%d.", response_length, errno);
    close(socket_handle);
    for(int countdown = 10; countdown >= 0; countdown--) {
        ESP_LOGI(TAG, "%d... ", countdown);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    free(message);
    ESP_LOGI(TAG, "DONE!");
}
