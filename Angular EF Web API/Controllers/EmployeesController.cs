using Angular_EF_Web_API.Entities;
using System.Threading.Tasks;

using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Net;
using System.Net.Http;

using System.Web.Http;
using System.Data.Entity;

namespace Angular_EF_Web_API.Controllers
{
    [RoutePrefix("api/Employees")]
    public class EmployeesController : ApiController
    {

        [HttpGet]
        [Route("GetEmployees")]
        public async Task<IHttpActionResult> GetEmployeesAsync()
        {
            try
            {
                using (DataContext db = new DataContext())
                {
                    return InternalServerError(new InvalidProgramException("FAKE ERROR"));
                    return Ok(await db.Employees.ToListAsync());
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
