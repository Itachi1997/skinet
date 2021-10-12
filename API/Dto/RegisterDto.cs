using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto
{
    public class RegisterDto
    {
        public string DisplayName { get; set; }
        public string email { get; set; }
        public string Password { get; set; }
    }
}