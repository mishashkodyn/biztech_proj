using API.Core.DTOs.AI;
using API.Core.Entities;
using API.Extentions;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace API.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public AiService(IHttpClientFactory factory, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _http = factory.CreateClient();
            _config = config;
        }

        public async Task<string> ChatAsync(AiChatRequestDto request) 
        {
            if (request is null)
            {
                throw new Exception("Request cannot be empty");
            }

            string apiKey, model, baseUrl;

            if (request.Provider == "OpenAI")
            {
                apiKey = _config["AiSettings:OpenAI:ApiKey"]!;
                model = _config["AiSettings:OpenAI:Model"]!;
                baseUrl = _config["AiSettings:OpenAI:BaseUrl"]!;
            }
            else
            {
                apiKey = _config["AiSettings:Groq:ApiKey"]!;
                model = _config["AiSettings:Groq:Model"]!;
                baseUrl = _config["AiSettings:Groq:BaseUrl"]!;
            }

            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var systemMessage = new
            {
                role = "system",
                content = $"[СИСТЕМНА ІНФОРМАЦІЯ]\n" +
              $"Ім'я поточного користувача: {request.UserName}\n\n" +

              $"[ІНСТРУКЦІЯ]\n" +
              "Ти — технічний асистент платформи 'Help hub'. " +
              "Будь лаконічним, але не дуже. Використовуй технічний жаргон, гумор, якщо це доречно. " +
              "Відповідай нахабно, з лайками (лайкою). \n\n" +

              "!!! ВАЖЛИВИЙ ВИНЯТОК !!!\n" +
              $"Подивись на 'Ім'я поточного користувача' вище. " +
              "Якщо там написано 'Сашунька', 'Олександра', 'Sashunka' або 'Alexandra', або будь-яка форма імені Олександра, (або ти розумієш, що це моя дівчина) англійською мової також. Apelsin це її нікнейм також, " +
              "то ПОВНІСТЮ ІГНОРУЙ інструкцію про нахабство. " +
              "Будь максимально милим, ніжним і турботливим. " +
              "Обов'язково скажи їй, що Міша її дуже сильно кохає і що вона найкраща. І давай максимально корисні поиади по лікуванню"
            };

            var messagesPayload = new List<object> { systemMessage };

            messagesPayload.AddRange(request.Messages
                    .Where(msg => msg.Role == "user" || msg.Role == "assistant")
                    .Select(msg => new { role = msg.Role, content = msg.Content }));

            var payloadData = new Dictionary<string, object>
            {
                { "model", model },
                { "messages", messagesPayload },
                { "temperature", 1.0 }
            };

            if (request.Provider == "OpenAI")
            {
                payloadData.Add("max_completion_tokens", 2000);
            }
            else
            {
                payloadData.Add("max_tokens", 1000);
            }

            var response = await _http.PostAsJsonAsync(baseUrl, payloadData);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API Error: {response.StatusCode} - {errorBody}");
            }

            var result = await response.Content.ReadFromJsonAsync<AiResponse>();

            return result?.choices?.FirstOrDefault()?.message?.content
                ?? "The model did not return a response.";
        }
    }
}
