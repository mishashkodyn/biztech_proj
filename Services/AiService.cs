using API.Core.DTOs.AI;
using API.Services.Interfaces;
using System.Net.Http.Headers;

namespace API.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _modelName;
        private readonly string _baseUrl;

        public AiService(IHttpClientFactory factory, IConfiguration config)
        {
            _http = factory.CreateClient();
            _apiKey = config["Groq:ApiKey"] ?? throw new Exception("Groq API key is missing");
            _modelName = config["Groq:Model"] ?? "llama-3.3-70b-versatile";
            _baseUrl = config["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1/chat/completions";
        }

        public async Task<string> ChatAsync(List<ChatMessageDto> request) 
        {
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var systemMessage = new
            {
                role = "system",
                content = "Ти — технічний асистент платформи 'Help hub'. Використовуй технічний жаргон, юмор якщо це доречно. І відповідай нахабно, з лайками, якщо це Сашунька(моя дівчина з якої я божеволію), то ні. якщо це Сашунька (це моя дівчина), скажи що я (Міша) кохаю її."
            };

            var messagesPayload = new List<object>();

            messagesPayload.Add(systemMessage);

            if (request != null)
            {
                foreach (var msg in request)
                {
                    if (msg.Role == "user" ||  msg.Role == "assistant")
                    {
                        messagesPayload.Add(msg);
                    }
                }
            }

            var payload = new
            {
                model = _modelName,
                messages = messagesPayload,
                temperature = 0.7,
                max_tokens = 1000
            };

            var response = await _http.PostAsJsonAsync(_baseUrl, payload);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error: {response.StatusCode} - {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<AiResponse>();

            return result?.choices?.FirstOrDefault()?.message?.content
                ?? "The model did not return a response.";
        }
    }
}
