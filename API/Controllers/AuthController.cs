using Microsoft.AspNetCore.Mvc;
using FisioScan.Business;
using FisioScan.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace FisioScan.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login-fisioterapeuta")]
        public IActionResult LoginPhysio([FromBody] LoginPhysioDTO loginPhysioDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var credentials = _authService.LoginPhysio(loginPhysioDTO.Email, loginPhysioDTO.Password);

                var token = _authService.GeneratePhysioToken(credentials);

                return Ok(new { token });
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"No se ha encontrado el fisioterapeuta con el email {loginPhysioDTO.Email}");
                return NotFound("No se ha encontrado el fisioterapeuta");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error durante el login: {ex.Message}");
                return BadRequest("Error durante el login.");
            }
        }
    }
}

