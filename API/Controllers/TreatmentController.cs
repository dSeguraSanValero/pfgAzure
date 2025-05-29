using Microsoft.AspNetCore.Mvc;
using FisioScan.Models;
using FisioScan.Business;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace FisioScan.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TreatmentController : ControllerBase
    {
        private readonly ILogger<TreatmentController> _logger;
        private readonly ITreatmentService _treatmentService;
        private readonly IAuthService _authService;

        public TreatmentController(ILogger<TreatmentController> logger, ITreatmentService treatmentService, IAuthService authService)
        {
            _logger = logger;
            _treatmentService = treatmentService;
            _authService = authService;
        }

        [Authorize]
        [HttpGet(Name = "GetAllTreatments")]
        public ActionResult<IEnumerable<Treatment>> SearchTreatment(int? treatmentId, int? patientId, int? createdBy, string? treatmentCause, DateTime treatmentDate)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    var treatments = _treatmentService.GetTreatments(treatmentId, patientId, createdBy, treatmentCause, treatmentDate);
                    
                    if (treatments == null || !treatments.Any())
                    {
                        return NotFound("No se encontraron tratamientos con los parámetros proporcionados.");
                    }

                    var transformedTreatments = treatments.Select(p => new
                    {
                        p.TreatmentId,
                        p.PatientId,
                        p.CreatedBy,
                        p.TreatmentCause,
                        TreatmentDate = p.TreatmentDate.ToString("MM-dd-yyyy")
                    }).ToList();

                    return Ok(transformedTreatments);
                }

                if (rolePhysioId.HasValue)
                {
                    createdBy = rolePhysioId.Value;
                    var treatments = _treatmentService.GetTreatments(treatmentId, patientId, createdBy, treatmentCause, treatmentDate);

                    if (treatments == null || !treatments.Any())
                    {
                        return NotFound("No se encontraron tratamientos con los parámetros proporcionados.");
                    }

                    var transformedTreatments = treatments.Select(p => new
                    {
                        p.TreatmentId,
                        p.PatientId,
                        p.CreatedBy,
                        p.TreatmentCause,
                        TreatmentDate = p.TreatmentDate.ToString("MM-dd-yyyy")
                    }).ToList();

                    return Ok(transformedTreatments);
                }
            }
            
            return Unauthorized("Acceso denegado");
        }


        [Authorize]
        [HttpPost]
        public IActionResult RegisterTreatment([FromBody] RegisterTreatmentDTO treatmentDTO)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    try
                    {
                        _treatmentService.RegisterTreatment(
                            patientId: treatmentDTO.PatientId,
                            createdBy: 1,
                            treatmentCause: treatmentDTO.TreatmentCause,
                            treatmentDate: treatmentDTO.TreatmentDate
                        );

                        return Ok(new { message = "Tratamiento registrado correctamente" });

                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }

                if (rolePhysioId.HasValue)
                {
                    try
                    {
                        _treatmentService.RegisterTreatment(
                            patientId: treatmentDTO.PatientId,
                            createdBy: rolePhysioId.Value,
                            treatmentCause: treatmentDTO.TreatmentCause,
                            treatmentDate: treatmentDTO.TreatmentDate
                        );

                        return Ok(new { message = "Tratamiento registrado correctamente" });

                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }  
            }

        return Unauthorized("Acceso denegado");
        }


        [Authorize]
        [HttpDelete("{treatmentId}")]
        public IActionResult RemoveTreatment(int treatmentId)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    try
                    {
                        _treatmentService.RemoveTreatment(treatmentId);
                        return Ok(new { message = "Tratamiento eliminado correctamente" });
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }

                if (rolePhysioId.HasValue)
                {
                    try
                    {
                        _treatmentService.RemoveTreatment(treatmentId);
                        return Ok(new { message = "Tratamiento eliminado correctamente" });
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }  
            }

            return Unauthorized("Acceso denegado");
        }


        [Authorize]
        [HttpPut("{treatmentId}")]
        public IActionResult UpdateTreatment(int treatmentId, [FromBody] UpdateTreatmentDTO treatmentDTO)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null || rolePhysioId.HasValue)
                {
                    try
                    {
                        _treatmentService.UpdateTreatment(
                            treatmentId,
                            treatmentDTO.TreatmentCause,
                            treatmentDTO.TreatmentDate
                        );

                        return Ok(new { message = "Tratamiento actualizado correctamente" });

                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }  
            }

            return Unauthorized("Acceso denegado");
        }
 
    }

}
