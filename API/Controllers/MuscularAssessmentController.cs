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
    public class MuscularAssessmentController : ControllerBase
    {
        private readonly ILogger<MuscularAssessmentController> _logger;
        private readonly IMuscularAssessmentService _muscularAssessmentService;
        private readonly IAuthService _authService;

        public MuscularAssessmentController(ILogger<MuscularAssessmentController> logger, IMuscularAssessmentService muscularAssessmentService, IAuthService authService)
        {
            _logger = logger;
            _muscularAssessmentService = muscularAssessmentService;
            _authService = authService;
        }


        [Authorize]
        [HttpGet(Name = "GetAllMuscularAssessments")]
        public ActionResult<IEnumerable<MuscularAssessment>> SearchMuscularAssessment(int? muscularAssessmentId, int? createdBy, int? treatmentId, string? muscleName, string? muscleAssessment)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    var muscularAssessments = _muscularAssessmentService.GetMuscularAssessments(muscularAssessmentId, createdBy, treatmentId, muscleName, muscleAssessment);

                    if (muscularAssessments == null || !muscularAssessments.Any())
                    {
                        return NotFound("No se encontraron valoraciones musculares con los parámetros proporcionados.");
                    }

                    return Ok(muscularAssessments);
                }

                if (rolePhysioId.HasValue)
                {
                    createdBy = rolePhysioId.Value;
                    var muscularAssessments = _muscularAssessmentService.GetMuscularAssessments(muscularAssessmentId, createdBy, treatmentId, muscleName, muscleAssessment);

                    if (muscularAssessments == null || !muscularAssessments.Any())
                    {
                        return NotFound("No se encontraron valoraciones generales con los parámetros proporcionados.");
                    }

                    var transformedMuscularAssessments = muscularAssessments.Select(p => new
                    {
                        p.MuscularAssessmentId,
                        p.CreatedBy,
                        p.TreatmentId,
                        p.MuscleName,
                        p.MuscleAssessment
                    }).ToList();

                    return Ok(transformedMuscularAssessments);
                }
            }

            return Unauthorized("Acceso denegado");
        }


        [Authorize]
        [HttpPost]
        public IActionResult RegisterMuscularAssessment([FromBody] RegisterMuscularAssessmentDTO muscularAssessmentDTO)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    try
                    {
                        _muscularAssessmentService.RegisterMuscularAssessment(
                            createdBy: 1,
                            treatmentId: muscularAssessmentDTO.TreatmentId,
                            muscleName: muscularAssessmentDTO.MuscleName,
                            muscleAssessment: muscularAssessmentDTO.MuscleAssessment
                        );

                        return Ok(new { message = "Valoración muscular registrada correctamente" });
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
                        _muscularAssessmentService.RegisterMuscularAssessment(
                            createdBy: rolePhysioId.Value,
                            treatmentId: muscularAssessmentDTO.TreatmentId,
                            muscleName: muscularAssessmentDTO.MuscleName,
                            muscleAssessment: muscularAssessmentDTO.MuscleAssessment
                        );

                        return Ok(new { message = "Valoración muscular registrada correctamente" });
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
        [HttpDelete]
        public IActionResult RemoveMuscularAssessments([FromQuery] int treatmentId)
        {
            if (!_authService.HasAccessToResource(User, out int? rolePhysioId))
                return Unauthorized("Acceso denegado");

            try
            {
                var muscularAssessments = _muscularAssessmentService
                    .GetMuscularAssessments(null, rolePhysioId, treatmentId, null, null)
                    .ToList();

                if (!muscularAssessments.Any())
                {
                    return NotFound("No se encontraron evaluaciones musculares asociadas al tratamiento.");
                }

                foreach (var assessment in muscularAssessments)
                {
                    _muscularAssessmentService.RemoveMuscularAssessment(assessment);
                }

                return Ok(new { message = "Evaluaciones musculares eliminadas correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error al eliminar evaluaciones musculares", details = ex.Message });
            }
        }


        [Authorize]
        [HttpPut("{muscularAssessmentId}")]
        public IActionResult UpdateMuscularAssessment(int muscularAssessmentId, [FromBody] UpdateMuscularAssessmentDTO muscularAssessmentDTO)
        {
            if (_authService.HasAccessToResource(User, out int? rolePhysioId))
            {
                if (rolePhysioId == null)
                {
                    var muscularAssessment = _muscularAssessmentService.GetMuscularAssessments(muscularAssessmentId, null, null, null, null).FirstOrDefault();
                    if (muscularAssessment == null)
                    {
                        return NotFound("Valoración muscular no encontrada.");
                    }

                    _muscularAssessmentService.UpdateMuscularAssessment(muscularAssessment, muscularAssessmentId, muscularAssessmentDTO.MuscleAssessment);
                    return Ok(new { message = "Valoración muscular actualizada correctamente" });
                }

                if (rolePhysioId.HasValue)
                {
                    var muscularAssessment = _muscularAssessmentService.GetMuscularAssessments(muscularAssessmentId, rolePhysioId.Value, null, null, null).FirstOrDefault();
                    if (muscularAssessment == null)
                    {
                        return NotFound("Valoración muscular no encontrada.");
                    }

                    _muscularAssessmentService.UpdateMuscularAssessment(muscularAssessment, muscularAssessmentId, muscularAssessmentDTO.MuscleAssessment);
                    return Ok(new { message = "Valoración muscular actualizada correctamente" });
                }
            }

            return Unauthorized("Acceso denegado");
        }
    }
}