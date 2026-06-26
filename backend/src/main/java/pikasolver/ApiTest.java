package pikasolver;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ApiTest {
    public static void main(String[] args) throws Exception {
        String baseUrl = "http://localhost:8080";
        HttpClient client = HttpClient.newHttpClient();

        post(client, baseUrl + "/api/game/generate", """
            {
              "rows": 4,
              "cols": 4,
              "tileTypes": 4
            }
        """);

        post(client, baseUrl + "/api/game/hint", """
            {
              "board": [
                [0,0,0,0],
                [0,1,1,0],
                [0,2,2,0],
                [0,0,0,0]
              ]
            }
        """);

        post(client, baseUrl + "/api/game/solve", """
            {
              "board": [
                [0,0,0,0],
                [0,1,1,0],
                [0,2,2,0],
                [0,0,0,0]
              ],
              "algorithm": "greedy"
            }
        """);
    }

    static void post(HttpClient client, String url, String json) throws Exception {
        System.out.println("\nPOST " + url);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        System.out.println("Status: " + response.statusCode());
        System.out.println(response.body());
    }
}