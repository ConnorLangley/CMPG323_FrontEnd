using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;

namespace Proj_Frame.Pages
{
    public class FileUploadModel : PageModel
    {
        private readonly HttpClient _httpClient;

        public string ApiData { get; set; }
       
        public void OnGet()
        {
            
        }

        public FileUploadModel(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
    }
}
