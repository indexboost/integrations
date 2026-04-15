using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace IndexBoost.IIS
{
    /// <summary>
    /// Classic ASP.NET (System.Web) HTTP Module that proxies crawler requests
    /// to the IndexBoost render service.
    ///
    /// For ASP.NET Core on IIS, use the package at integrations/aspnet/ instead.
    /// </summary>
    public class IndexBoostModule : IHttpModule
    {
        private const string RenderBase = "https://render.getindexboost.com";
        private static readonly string Token = Environment.GetEnvironmentVariable("INDEXBOOST_TOKEN") ?? "";

        private static readonly Regex CrawlerRe = new Regex(
            @"googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex StaticRe = new Regex(
            @"\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly HttpClient Http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };

        public void Init(HttpApplication context)
        {
            var wrapper = new EventHandlerTaskAsyncHelper(BeginRequestAsync);
            context.AddOnBeginRequestAsync(wrapper.BeginEventHandler, wrapper.EndEventHandler);
        }

        private async Task BeginRequestAsync(object sender, EventArgs e)
        {
            var app = (HttpApplication)sender;
            var request = app.Request;
            var response = app.Response;

            if (string.IsNullOrEmpty(Token)) return;

            var ua = request.UserAgent ?? "";
            var path = request.Url.AbsolutePath;

            if (!CrawlerRe.IsMatch(ua) || StaticRe.IsMatch(path)) return;

            try
            {
                var targetUrl = request.Url.AbsoluteUri;
                var encodedUrl = Uri.EscapeDataString(targetUrl);
                var renderUrl = $"{RenderBase}/?url={encodedUrl}";

                using var req = new HttpRequestMessage(HttpMethod.Get, renderUrl);
                req.Headers.Add("X-INDEXBOOST-TOKEN", Token);

                using var res = await Http.SendAsync(req).ConfigureAwait(false);
                if (!res.IsSuccessStatusCode) return;

                var html = await res.Content.ReadAsStringAsync().ConfigureAwait(false);

                response.Clear();
                response.StatusCode = 200;
                response.ContentType = "text/html; charset=utf-8";
                response.Write(html);
                response.End();
            }
            catch
            {
                // Fall through to normal IIS pipeline
            }
        }

        public void Dispose() { }
    }
}
